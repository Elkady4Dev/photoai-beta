import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface IcaoCheck {
  pass: boolean;
  detail: string;
}

export interface IcaoCompliance {
  overall_pass: boolean;
  confidence_score: number;
  checks: Record<string, IcaoCheck>;
  issues: string[];
  recommendation: 'ACCEPT' | 'REJECT' | 'REVIEW';
}

export interface PhotoResult {
  variationId: number;
  imageDataUrl: string;
  filename: string;
  mimeType: string;
  photoType?: string;
  dimensions?: string;
  icaoCompliance?: IcaoCompliance;
}

export type JobStatus = 'idle' | 'submitting' | 'processing' | 'completed' | 'failed' | 'timeout';

interface SubmitParams {
  imageBase64: string;
  mimeType: string;
  photoType: string;
  includeShoulders: boolean;
  testerToken: string;
}

interface UsePhotoJobOptions {
  totalVariations?: number;
  timeoutMs?: number;
}

export function usePhotoJob(options: UsePhotoJobOptions = {}) {
  const { totalVariations: expectedTotal = 4, timeoutMs = 5 * 60 * 1000 } = options;

  const [jobStatus, setJobStatus] = useState<JobStatus>('idle');
  const [results, setResults] = useState<Map<number, PhotoResult>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [totalVariations, setTotalVariations] = useState(expectedTotal);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const jobIdRef = useRef<string | null>(null);

  // Track completed count from results map
  const completedCount = results.size;

  // Auto-complete when all variations arrive
  useEffect(() => {
    if (completedCount > 0 && completedCount >= totalVariations && jobStatus === 'processing') {
      setJobStatus('completed');
      cleanup();
    }
  }, [completedCount, totalVariations, jobStatus]);

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const submitPhoto = useCallback(async (params: SubmitParams) => {
    const { imageBase64, mimeType, photoType, includeShoulders, testerToken } = params;

    setJobStatus('submitting');
    setError(null);
    setResults(new Map());

    try {
      // --- Call process-photo edge function ---
      const headers: Record<string, string> = { 'x-tester-auth': testerToken };
      if (import.meta.env.DEV) {
        headers['x-use-test'] = 'true';
      }

      const { data, error: fnError } = await supabase.functions.invoke('process-photo', {
        headers,
        body: {
          image: imageBase64,
          photoType,
          includeShoulders,
          mimeType,
        },
      });

      if (fnError) {
        const status = (fnError as unknown as { status?: number })?.status;
        if (status === 401) {
          window.location.assign('/unauthorized');
          return;
        }
        if (status === 403) {
          setError('You have used all your allotted photo generations. Please contact the admin for more.');
          setJobStatus('failed');
          return;
        }
        if (status === 429) {
          setError('Too many requests. Please wait a minute and try again.');
          setJobStatus('failed');
          return;
        }
        throw new Error(fnError.message || 'Failed to start photo processing');
      }

      const jobId = data?.jobId;
      const total = data?.totalVariations ?? expectedTotal;

      if (!jobId) {
        throw new Error('No jobId returned from edge function');
      }

      jobIdRef.current = jobId;
      setTotalVariations(total);
      setJobStatus('processing');

      // --- Subscribe to Realtime Broadcast channel ---
      const channelName = `job-${jobId}`;
      console.log(`[usePhotoJob] Subscribing to channel: "${channelName}"`);
      const channel = supabase.channel(channelName);

      channel.on('broadcast', { event: 'photo-result' }, (message) => {
        console.log('[usePhotoJob] Received photo-result broadcast:', JSON.stringify(message).slice(0, 200));
        const payload = message.payload as {
          variationId: number;
          imageBase64: string;
          mimeType: string;
          filename: string;
          photoType?: string;
          dimensions?: string;
          icaoCompliance?: IcaoCompliance;
        };

        if (!payload.variationId || !payload.imageBase64) {
          console.warn('[usePhotoJob] Missing variationId or imageBase64 in payload');
          return;
        }

        console.log(`[usePhotoJob] Got variation ${payload.variationId}, base64 length: ${payload.imageBase64?.length}`);
        const imageDataUrl = `data:${payload.mimeType || 'image/png'};base64,${payload.imageBase64}`;

        setResults(prev => {
          const next = new Map(prev);
          next.set(payload.variationId, {
            variationId: payload.variationId,
            imageDataUrl,
            filename: payload.filename || `variation_${payload.variationId}.png`,
            mimeType: payload.mimeType || 'image/png',
            photoType: payload.photoType,
            dimensions: payload.dimensions,
            icaoCompliance: payload.icaoCompliance,
          });
          return next;
        });
      });

      channel.on('broadcast', { event: 'job-error' }, (message) => {
        console.error('[usePhotoJob] Job error broadcast:', message);
        const payload = message.payload as { error?: string };
        setError(payload.error || 'Photo processing failed');
        setJobStatus('failed');
        cleanup();
      });

      channel.subscribe((status) => {
        console.log(`[usePhotoJob] Channel "${channelName}" subscription status: ${status}`);
        if (status === 'CHANNEL_ERROR') {
          console.error('[usePhotoJob] Realtime channel error for', channelName);
        }
        if (status === 'SUBSCRIBED') {
          console.log(`[usePhotoJob] Successfully subscribed to "${channelName}" — waiting for broadcasts`);
        }
      });

      channelRef.current = channel;

      // --- Start timeout ---
      timeoutRef.current = setTimeout(() => {
        // If we have some results, treat as partial completion
        setResults(prev => {
          if (prev.size > 0 && prev.size < total) {
            setJobStatus('completed');
            setError(`Only ${prev.size} of ${total} photos were generated. You can choose from the available ones.`);
          } else if (prev.size === 0) {
            setJobStatus('timeout');
            setError('Photo processing timed out. Please try again.');
          }
          return prev;
        });
        cleanup();
      }, timeoutMs);

    } catch (err) {
      console.error('Error submitting photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to process photo');
      setJobStatus('failed');
    }
  }, [expectedTotal, timeoutMs, cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setJobStatus('idle');
    setResults(new Map());
    setError(null);
    jobIdRef.current = null;
  }, [cleanup]);

  return {
    jobStatus,
    results,
    completedCount,
    totalVariations,
    error,
    submitPhoto,
    reset,
  };
}
