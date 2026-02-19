import { useState, useEffect, useRef } from "react";
import { Check, Loader2, AlertCircle, Download, ShieldCheck, ShieldAlert, ShieldQuestion, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { usePhotoJob, type PhotoResult, type IcaoCompliance } from "@/hooks/use-photo-job";
import { cropToAspectRatio } from "@/utils/cropToAspectRatio";
import { WatermarkOverlay } from "@/components/WatermarkOverlay";
import type { DocumentType } from "@/pages/Index";

const getTesterToken = (): string | null => {
  // 1. sessionStorage (logged-in users — stored invisibly by TokenPreserver)
  const sessionToken = sessionStorage.getItem('_t');
  if (sessionToken) return sessionToken;

  // 2. URL fallback for dev/tester tokens (e.g. keshodevtoken)
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('access');
  if (urlToken) return urlToken;

  // 3. Legacy localStorage fallback
  try {
    const raw = localStorage.getItem('tester_auth');
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string; expiresAt?: number };
    if (!parsed?.token || !parsed?.expiresAt) return null;
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem('tester_auth');
      return null;
    }
    return parsed.token;
  } catch {
    return null;
  }
};

// --- Sub-components ---

function IcaoBadge({ compliance }: { compliance: IcaoCompliance }) {
  const { recommendation, confidence_score } = compliance;

  const config = {
    ACCEPT: { icon: ShieldCheck, label: 'ICAO OK', bg: 'bg-green-500/90', text: 'text-white' },
    REVIEW: { icon: ShieldQuestion, label: 'Review', bg: 'bg-yellow-500/90', text: 'text-white' },
    REJECT: { icon: ShieldAlert, label: 'Failed', bg: 'bg-red-500/90', text: 'text-white' },
  }[recommendation] ?? { icon: ShieldQuestion, label: 'Unknown', bg: 'bg-gray-500/90', text: 'text-white' };

  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.bg} backdrop-blur-sm ${config.text} text-xs font-medium`}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
      <span className="opacity-80">{confidence_score}%</span>
    </div>
  );
}

function IcaoDetails({ compliance }: { compliance: IcaoCompliance }) {
  const [expanded, setExpanded] = useState(false);
  const { checks, issues } = compliance;
  const checkEntries = Object.entries(checks);

  return (
    <div className="mt-2">
      <button
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {issues.length > 0 ? `${issues.length} issue${issues.length > 1 ? 's' : ''}` : 'All checks passed'}
      </button>

      {expanded && (
        <div className="mt-2 space-y-1 text-xs animate-fade-in">
          {checkEntries.map(([key, check]) => (
            <div key={key} className="flex items-start gap-2">
              <span className={`mt-0.5 shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                check.pass ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
              }`}>
                {check.pass ? '✓' : '✗'}
              </span>
              <div>
                <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                <span className="text-muted-foreground ml-1">— {check.detail}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function VariationSkeleton({
  variationId,
  aspectClass = 'aspect-[3/4]',
  startTime
}: {
  variationId: number;
  aspectClass?: string;
  startTime: number;
}) {
  const [elapsed, setElapsed] = useState(0);
  const expectedDuration = 30; // Expected ~30 seconds per variation

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - startTime) / 1000);
      setElapsed(seconds);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime]);

  // Progress fills up over expected duration, then slows down but keeps going
  const progressPercent = elapsed < expectedDuration
    ? (elapsed / expectedDuration) * 90  // Fill to 90% in expected time
    : 90 + Math.min((elapsed - expectedDuration) / 60 * 10, 9); // Slowly creep to 99% after

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
  };

  return (
    <div className={`relative ${aspectClass} rounded-2xl overflow-hidden shadow-card bg-muted`}>
      <Skeleton className="w-full h-full rounded-2xl" />

      {/* Variation number badge */}
      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-sm font-semibold text-foreground">
        {variationId}
      </div>

      {/* Center content: spinner + timer + progress */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />

        {/* Timer display */}
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-foreground">
            {formatTime(elapsed)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Generating...
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-[120px]">
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </div>
    </div>
  );
}

const ASPECT_CLASSES: Record<string, string> = {
  passport: 'aspect-[2/3]',
  visa: 'aspect-square',
  id: 'aspect-[5/7]',
};

function VariationCard({
  result,
  isSelected,
  onSelect,
  aspectClass = 'aspect-[3/4]',
}: {
  result: PhotoResult;
  isSelected: boolean;
  onSelect: () => void;
  aspectClass?: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const icao = result.icaoCompliance;

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = result.imageDataUrl;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button
        onClick={onSelect}
        className={`relative ${aspectClass} w-full rounded-2xl overflow-hidden transition-all duration-300 ${
          isSelected
            ? "ring-4 ring-accent scale-[1.02] shadow-accent"
            : "shadow-card hover:shadow-card-lg hover:scale-[1.01]"
        }`}
      >
        {!imageLoaded && <Skeleton className="absolute inset-0 rounded-2xl" />}

        <img
          src={result.imageDataUrl}
          alt={`Variation ${result.variationId}`}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Translucent watermark overlay — display only, doesn't affect downloads */}
        <WatermarkOverlay />

        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center text-sm font-semibold text-foreground">
          {result.variationId}
        </div>

        {isSelected && (
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gradient-accent flex items-center justify-center">
            <Check className="w-5 h-5 text-accent-foreground" />
          </div>
        )}

        {/* ICAO compliance badge */}
        {icao && (
          <div className="absolute bottom-3 left-3">
            <IcaoBadge compliance={icao} />
          </div>
        )}

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-retro-dark/80 backdrop-blur-sm flex items-center justify-center hover:bg-retro-dark transition-colors"
          title="Download this variation"
        >
          <Download className="w-4 h-4 text-retro-cream" />
        </button>

        <div className={`absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent transition-opacity ${
          isSelected ? "opacity-100" : "opacity-0"
        }`} />
      </button>

      {/* ICAO expandable details below card */}
      {icao && <IcaoDetails compliance={icao} />}
    </div>
  );
}

function ProgressIndicator({
  completedCount,
  total,
  isComplete,
}: {
  completedCount: number;
  total: number;
  isComplete: boolean;
}) {
  const percentage = total > 0 ? (completedCount / total) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm text-muted-foreground">
          {isComplete
            ? 'All variations ready!'
            : `Processing... ${completedCount} of ${total} ready`}
        </p>
        <span className="text-sm font-medium text-foreground">{Math.round(percentage)}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

// --- Main Component ---

interface PhotoVariationsProps {
  documentType: DocumentType;
  originalPhoto: string;
  onSelectVariation: (index: number, variationData?: PhotoResult) => void;
  onBack: () => void;
  isDemoMode?: boolean;
}

export const PhotoVariations = ({
  documentType,
  originalPhoto,
  onSelectVariation,
  onBack,
  isDemoMode = false,
}: PhotoVariationsProps) => {
  const {
    jobStatus,
    results,
    completedCount,
    totalVariations,
    error,
    submitPhoto,
  } = usePhotoJob({ totalVariations: 4, timeoutMs: 5 * 60 * 1000 });

  const [selectedVariationId, setSelectedVariationId] = useState<number | null>(null);
  const [croppedResults, setCroppedResults] = useState<Map<number, PhotoResult>>(new Map());
  const [jobStartTime, setJobStartTime] = useState<number>(Date.now());
  const { toast } = useToast();
  const hasSubmitted = useRef(false);
  const croppingRef = useRef<Set<number>>(new Set());

  // Crop each variation to the correct aspect ratio as it arrives
  useEffect(() => {
    results.forEach((result, vid) => {
      if (croppedResults.has(vid) || croppingRef.current.has(vid)) return;
      croppingRef.current.add(vid);
      cropToAspectRatio(result.imageDataUrl, documentType).then(croppedUrl => {
        setCroppedResults(prev => {
          const next = new Map(prev);
          next.set(vid, { ...result, imageDataUrl: croppedUrl });
          return next;
        });
      });
    });
  }, [results, documentType, croppedResults]);

  const documentLabels: Record<DocumentType, string> = {
    passport: "4 x 6",
    visa: "2 x 2",
    id: "Wallet Size",
  };

  const photoTypeMap: Record<DocumentType, string> = {
    passport: '4 x 6 Photo',
    visa: '2 x 2 Photo',
    id: 'Wallet Size Photo',
  };

  // Demo mode - use sample images
  const demoResults: PhotoResult[] = [
    {
      variationId: 1,
      imageDataUrl: 'https://picsum.photos/300/400?random=photo1',
      filename: 'demo-variation-1.jpg',
      mimeType: 'image/jpeg',
      photoType: documentType ? photoTypeMap[documentType] : 'Passport Photo',
    },
    {
      variationId: 2,
      imageDataUrl: 'https://picsum.photos/300/400?random=photo2',
      filename: 'demo-variation-2.jpg',
      mimeType: 'image/jpeg',
      photoType: documentType ? photoTypeMap[documentType] : 'Passport Photo',
    },
    {
      variationId: 3,
      imageDataUrl: 'https://picsum.photos/300/400?random=photo3',
      filename: 'demo-variation-3.jpg',
      mimeType: 'image/jpeg',
      photoType: documentType ? photoTypeMap[documentType] : 'Passport Photo',
    },
    {
      variationId: 4,
      imageDataUrl: 'https://picsum.photos/300/400?random=photo4',
      filename: 'demo-variation-4.jpg',
      mimeType: 'image/jpeg',
      photoType: documentType ? photoTypeMap[documentType] : 'Passport Photo',
    },
  ];

  // Submit on mount
  useEffect(() => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    if (isDemoMode) return;

    // Guard: if documentType is missing, redirect rather than crash
    if (!documentType) {
      window.location.href = `${import.meta.env.BASE_URL}photo-capture`;
      return;
    }

    const testerToken = getTesterToken();
    if (!testerToken) {
      window.location.assign('/unauthorized');
      return;
    }

    let imageBase64 = originalPhoto;
    let mimeType = 'image/png';
    if (originalPhoto.startsWith('data:')) {
      const matches = originalPhoto.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        mimeType = matches[1];
        imageBase64 = matches[2];
      }
    }

    setJobStartTime(Date.now());
    submitPhoto({
      imageBase64,
      mimeType,
      photoType: photoTypeMap[documentType],
      includeShoulders: true,
      testerToken,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show toast for partial completion errors
  useEffect(() => {
    if (error && completedCount > 0 && jobStatus === 'completed') {
      toast({
        title: "Partial results",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, completedCount, jobStatus, toast]);

  // ✅ Safe label lookup — fallback to empty string if documentType is somehow undefined
  const label = (documentType && documentLabels[documentType]) ?? '';

  // ✅ Guard AFTER all hooks — if documentType is missing, render nothing and redirect
  if (!documentType) {
    window.location.href = `${import.meta.env.BASE_URL}photo-capture`;
    return null;
  }

  const isComplete = isDemoMode || jobStatus === 'completed';
  const isFatalError = !isDemoMode && ((jobStatus === 'failed' || jobStatus === 'timeout') && completedCount === 0);
  const showGrid = !isFatalError;
  const displayCompletedCount = isDemoMode ? 4 : completedCount;

  return (
    <div className="min-h-screen bg-background">

      {/* Demo Mode Indicator */}
      {isDemoMode && (
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-4 shadow-lg mb-8 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold">Demo Mode Active</h4>
                  <p className="text-sm opacity-90">Using sample variations for testing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Fatal error: no results at all */}
          {isFatalError && (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <AlertCircle className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
                {jobStatus === 'timeout' ? 'Processing is taking too long' : "Can't process right now"}
              </h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                {error || 'Something went wrong. Please try again.'}
              </p>
              <Button variant="outline" onClick={onBack}>
                Go back
              </Button>
            </div>
          )}

          {/* Progressive grid */}
          {showGrid && (
            <div className="animate-slide-up">
              <ProgressIndicator
                completedCount={displayCompletedCount}
                total={totalVariations}
                isComplete={isComplete}
              />

              <p className="text-center text-muted-foreground mb-6">
                {isComplete
                  ? `Select the variation you prefer. All photos meet ${label} requirements.`
                  : displayCompletedCount > 0
                    ? 'Select a variation as they arrive. More on the way...'
                    : `Our AI is generating ${label.toLowerCase()} photo variations...`}
              </p>

              <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
                {[1, 2, 3, 4].map(vid => {
                  const result = isDemoMode
                    ? demoResults.find(r => r.variationId === vid)
                    : croppedResults.get(vid);
                  const aspect = ASPECT_CLASSES[documentType] || 'aspect-[3/4]';
                  return result ? (
                    <VariationCard
                      key={vid}
                      result={result}
                      isSelected={selectedVariationId === vid}
                      aspectClass={aspect}
                      onSelect={() => {
                        setSelectedVariationId(vid);
                        onSelectVariation(vid - 1, result);
                      }}
                    />
                  ) : (
                    <VariationSkeleton key={vid} variationId={vid} aspectClass={aspect} startTime={jobStartTime} />
                  );
                })}
              </div>

              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={() => selectedVariationId !== null && onSelectVariation(selectedVariationId - 1)}
                disabled={selectedVariationId === null}
              >
                Continue with Selection
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};