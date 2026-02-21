import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tester-auth, x-use-test',
};

/** Broadcast via Supabase Realtime REST API (no WebSocket needed). */
async function broadcast(
  channelName: string,
  event: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const url = Deno.env.get('SUPABASE_URL')!;
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const res = await fetch(`${url}/realtime/v1/api/broadcast`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'apikey': key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{
        topic: channelName,
        event,
        payload,
      }],
    }),
  }).catch(e => { console.error('Broadcast error:', e); return null; });
  if (res && !res.ok) {
    const text = await res.text();
    console.error(`Broadcast failed (${res.status}):`, text);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- 1. Extract token ---
    const url = new URL(req.url);
    const tokenFromQuery = url.searchParams.get('access') || '';
    const tokenFromHeader = req.headers.get('x-tester-auth') || '';
    const providedToken = tokenFromHeader || tokenFromQuery;

    if (!providedToken) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', code: 'NO_TOKEN' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- 2. Auth + limit check via DB (atomic) ---
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data, error: rpcError } = await supabaseAdmin.rpc('use_generation', {
      p_token: providedToken,
    });

    if (rpcError) {
      console.error('RPC error:', rpcError);
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = Array.isArray(data) ? data[0] : data;

    if (!result?.allowed) {
      const errorCode = result?.error_code || 'UNKNOWN';

      if (errorCode === 'LIMIT_EXHAUSTED') {
        return new Response(
          JSON.stringify({
            error: 'Generation limit reached',
            code: 'LIMIT_EXHAUSTED',
            message: 'You have used all your allotted photo generations. Contact the admin for more.',
          }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // INVALID_TOKEN or TOKEN_DISABLED
      return new Response(
        JSON.stringify({ error: 'Unauthorized', code: errorCode }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- 3. Parse request body ---
    const { image, photoType, includeShoulders, mimeType } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'No image provided. Please include base64 encoded image in request body.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- Pick test or production n8n webhook ---
    const useTest = req.headers.get('x-use-test') === 'true';
    const N8N_WEBHOOK_URL = useTest
      ? (Deno.env.get('N8N_WEBHOOK_URL_TEST') || Deno.env.get('N8N_WEBHOOK_URL'))
      : Deno.env.get('N8N_WEBHOOK_URL');

    if (!N8N_WEBHOOK_URL) {
      console.error('N8N_WEBHOOK_URL is not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook URL not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Using ${useTest ? 'TEST' : 'PRODUCTION'} webhook: ${N8N_WEBHOOK_URL}`);

    // --- 4. Generate job ID and create job record ---
    const jobId = `${crypto.randomUUID()}_${Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map(b => b.toString(16).padStart(2, '0')).join('')}`;

    const { error: jobInsertError } = await supabaseAdmin
      .from('photo_jobs')
      .insert({
        job_id: jobId,
        tester_token: providedToken,
        photo_type: photoType || 'Passport',
        status: 'processing',
      });

    if (jobInsertError) {
      console.error('Failed to create job:', jobInsertError);
      return new Response(
        JSON.stringify({ error: 'Failed to initialize processing job' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- 5. Fire-and-forget to n8n ---
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const callbackUrl = `${SUPABASE_URL}/functions/v1/photo-callback`;

    console.log(`Job ${jobId} created. Token verified (${result.remaining} gens remaining). Firing to n8n...`);

    // Fire to n8n — do NOT await. n8n accepts the webhook and processes async.
    fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image,
        photoType: photoType || 'Passport (40x60mm)',
        includeShoulders: includeShoulders !== false,
        mimeType: mimeType || 'image/png',
        jobId,
        callbackUrl,
      }),
    }).then(async (resp) => {
      if (!resp.ok) {
        const text = await resp.text();
        console.error(`n8n webhook failed for job ${jobId}: ${resp.status} ${text}`);
        await supabaseAdmin
          .from('photo_jobs')
          .update({ status: 'failed', error_message: `n8n error: ${resp.status}`, updated_at: new Date().toISOString() })
          .eq('job_id', jobId);

        await broadcast(`job-${jobId}`, 'job-error', { jobId, error: `Workflow failed: ${resp.status}` });
      } else {
        console.log(`n8n accepted job ${jobId}`);
      }
    }).catch(async (err) => {
      console.error(`n8n fetch error for job ${jobId}:`, err);
      await supabaseAdmin
        .from('photo_jobs')
        .update({ status: 'failed', error_message: `Connection error: ${err.message}`, updated_at: new Date().toISOString() })
        .eq('job_id', jobId);

      await broadcast(`job-${jobId}`, 'job-error', { jobId, error: `Connection error: ${err.message}` });
    });

    // --- 6. Return immediately with jobId ---
    return new Response(
      JSON.stringify({
        jobId,
        totalVariations: 4,
        message: 'Photo processing started. Subscribe to realtime updates.',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in process-photo function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
