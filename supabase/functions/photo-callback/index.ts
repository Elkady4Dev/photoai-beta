import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
};

/**
 * Broadcast a message via the Supabase Realtime REST API.
 * This avoids WebSocket subscription — just a plain HTTP POST.
 */
async function broadcast(
  channelName: string,
  event: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const res = await fetch(`${SUPABASE_URL}/realtime/v1/api/broadcast`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'apikey': SERVICE_ROLE_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          topic: channelName,
          event,
          payload,
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`Broadcast failed (${res.status}):`, text);
  } else {
    console.log(`Broadcast OK -> channel="${channelName}", event="${event}", payloadKeys=${Object.keys(payload).join(',')}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await req.json();
    const {
      jobId,
      variationId,
      totalVariations,
      success,
      imageBase64,
      mimeType,
      filename,
      photoType,
      dimensions,
      completedAt,
      icaoCompliance,
    } = body;

    // --- Validate required fields ---
    if (!jobId || variationId === undefined || variationId === null) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: jobId, variationId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // --- Verify the job exists and is active ---
    const { data: job, error: jobError } = await supabaseAdmin
      .from('photo_jobs')
      .select('*')
      .eq('job_id', jobId)
      .single();

    if (jobError || !job) {
      console.error(`Unknown jobId: ${jobId}`, jobError);
      return new Response(
        JSON.stringify({ error: 'Unknown or invalid jobId' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (job.status === 'failed' || job.status === 'expired') {
      return new Response(
        JSON.stringify({ error: `Job is ${job.status}` }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const channelName = `job-${jobId}`;

    // --- Handle failure callback from n8n ---
    if (!success) {
      console.error(`Variation ${variationId} failed for job ${jobId}`);

      await supabaseAdmin
        .from('photo_jobs')
        .update({
          status: 'failed',
          error_message: `Variation ${variationId} processing failed`,
          updated_at: new Date().toISOString(),
        })
        .eq('job_id', jobId);

      await broadcast(channelName, 'job-error', {
        jobId,
        variationId,
        error: `Variation ${variationId} failed to process`,
      });

      return new Response(
        JSON.stringify({ received: true, status: 'job_marked_failed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'Missing imageBase64 for successful variation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // --- Broadcast image directly to frontend (no persistence) ---
    const broadcastPayload: Record<string, unknown> = {
      jobId,
      variationId,
      imageBase64,
      mimeType: mimeType || 'image/png',
      filename: filename || `variation_${variationId}.png`,
      photoType: photoType || null,
      dimensions: dimensions || null,
      completedAt: completedAt || new Date().toISOString(),
    };

    // Forward ICAO compliance data if present (passport photos only)
    if (icaoCompliance) {
      broadcastPayload.icaoCompliance = icaoCompliance;
    }

    await broadcast(channelName, 'photo-result', broadcastPayload);

    // --- Update job progress (metadata only) ---
    const { data: progress, error: progressError } = await supabaseAdmin.rpc(
      'increment_job_progress',
      { p_job_id: jobId }
    );

    if (progressError) {
      console.error('Failed to update job progress:', progressError);
    }

    const progressData = Array.isArray(progress) ? progress[0] : progress;
    console.log(
      `Job ${jobId}: variation ${variationId} broadcast. ` +
      `Progress: ${progressData?.completed_count ?? '?'}/${totalVariations ?? 4}`
    );

    return new Response(
      JSON.stringify({ received: true, variationId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in photo-callback:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
