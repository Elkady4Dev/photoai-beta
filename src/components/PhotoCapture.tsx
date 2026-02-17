import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, RotateCcw, Check, AlertCircle, Lightbulb, Focus, Upload, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, LoadingOverlay } from "@/components/LoadingSpinner";

interface PhotoCaptureProps {
  onPhotoCapture: (photo: string) => void;
  onBack: () => void;
  isDemoMode?: boolean;
}

interface ValidationState {
  faceDetected: boolean;
  centered: boolean;
  goodFraming: boolean;
}

/**
 * Lightweight skin-tone face detection using canvas pixel analysis.
 * Analyses the oval region in the centre of the video frame:
 *   1. faceDetected  — enough skin-tone pixels in the oval area
 *   2. centered      — the skin-tone cluster is within the middle portion
 *   3. goodFraming   — the cluster covers a reasonable % of the oval (not too small / too large)
 *
 * Works in every browser — no flags or external libraries needed.
 */
function analyseFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): ValidationState {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || video.readyState < 2) {
    return { faceDetected: false, centered: false, goodFraming: false };
  }

  // Down-sample to ~160px wide for speed
  const scale = 160 / video.videoWidth;
  const w = Math.round(video.videoWidth * scale);
  const h = Math.round(video.videoHeight * scale);
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(video, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Define the oval guide region (matches the CSS oval: centred, ~48x60 relative to 192px card)
  const ovalCx = w / 2;
  const ovalCy = h / 2;
  const ovalRx = w * 0.28; // horizontal radius
  const ovalRy = h * 0.32; // vertical radius

  let skinInOval = 0;
  let totalOval = 0;
  let skinSumX = 0;
  let skinSumY = 0;
  let totalSkin = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Check if pixel is inside the oval
      const dx = (x - ovalCx) / ovalRx;
      const dy = (y - ovalCy) / ovalRy;
      const inOval = (dx * dx + dy * dy) <= 1;

      // Skin-tone detection (RGB heuristic — works across diverse skin tones)
      const isSkin =
        r > 60 && g > 40 && b > 20 &&
        r > g && r > b &&
        (r - g) > 10 &&
        Math.abs(r - g) < 130 &&
        (r - b) > 15;

      if (inOval) {
        totalOval++;
        if (isSkin) {
          skinInOval++;
          skinSumX += x;
          skinSumY += y;
          totalSkin++;
        }
      }
    }
  }

  if (totalOval === 0) {
    return { faceDetected: false, centered: false, goodFraming: false };
  }

  const skinRatio = skinInOval / totalOval;

  // Face detected: at least 15% of the oval region is skin-toned
  const faceDetected = skinRatio > 0.15;

  if (!faceDetected || totalSkin === 0) {
    return { faceDetected: false, centered: false, goodFraming: false };
  }

  // Centroid of skin pixels
  const avgX = skinSumX / totalSkin;
  const avgY = skinSumY / totalSkin;

  // Centered: skin centroid is within 20% of the oval centre
  const centeredX = Math.abs(avgX - ovalCx) < ovalRx * 0.4;
  const centeredY = Math.abs(avgY - ovalCy) < ovalRy * 0.4;
  const centered = centeredX && centeredY;

  // Good framing: skin covers between 20% and 75% of the oval (face is an appropriate size)
  const goodFraming = skinRatio > 0.20 && skinRatio < 0.75;

  return { faceDetected, centered, goodFraming };
}

export const PhotoCapture = ({ onPhotoCapture, onBack, isDemoMode = false }: PhotoCaptureProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    faceDetected: false,
    centered: false,
    goodFraming: false,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionLoopRef = useRef<number | null>(null);

  // ---- Face detection loop ----
  const runDetection = useCallback(() => {
    const video = videoRef.current;
    if (!video || !detectionCanvasRef.current) return;

    const result = analyseFrame(video, detectionCanvasRef.current);
    setValidation(result);
  }, []);

  const startDetectionLoop = useCallback(() => {
    // Create an offscreen canvas for analysis (never rendered)
    if (!detectionCanvasRef.current) {
      detectionCanvasRef.current = document.createElement('canvas');
    }

    // Run at ~5fps to save CPU
    const intervalLoop = () => {
      runDetection();
      detectionLoopRef.current = window.setTimeout(intervalLoop, 200) as unknown as number;
    };
    intervalLoop();
  }, [runDetection]);

  const stopDetectionLoop = useCallback(() => {
    if (detectionLoopRef.current !== null) {
      window.clearTimeout(detectionLoopRef.current);
      detectionLoopRef.current = null;
    }
  }, []);

  // ---- Camera start / stop ----
  const startCamera = useCallback(async () => {
    try {
      setIsCameraLoading(true);
      setValidation({ faceDetected: false, centered: false, goodFraming: false });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }

      // Wait for video to start playing, then begin face detection
      const onPlaying = () => {
        setIsCameraLoading(false);
        startDetectionLoop();
        videoRef.current?.removeEventListener('playing', onPlaying);
      };
      videoRef.current?.addEventListener('playing', onPlaying);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCameraLoading(false);
    }
  }, [startDetectionLoop]);

  const stopCamera = useCallback(() => {
    stopDetectionLoop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stopDetectionLoop]);

  useEffect(() => {
    if (!isDemoMode && !capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isDemoMode, capturedImage, startCamera, stopCamera]);

  useEffect(() => {
    if (isDemoMode) {
      setValidation({ faceDetected: true, centered: true, goodFraming: true });
      setIsCameraLoading(false);
    }
  }, [isDemoMode]);

  useEffect(() => {
    if (isDemoMode && !capturedImage) {
      setCapturedImage('https://picsum.photos/400/600?random=portrait');
    }
  }, [isDemoMode, capturedImage]);

  // ---- Capture / Retake / Upload ----
  const capturePhoto = () => {
    if (isDemoMode) {
      setIsCapturing(true);
      setTimeout(() => {
        setIsCapturing(false);
        onPhotoCapture(capturedImage!);
      }, 500);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.95);
      setCapturedImage(imageData);
      stopCamera();
    }
    setTimeout(() => setIsCapturing(false), 500);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    if (!isDemoMode) {
      startCamera();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const maxDim = 1200;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
        else { w = Math.round(w * maxDim / h); h = maxDim; }
      }

      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const compressed = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(compressed);
      stopCamera();
    };
    img.src = URL.createObjectURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onPhotoCapture(capturedImage);
    }
  };

  const allValid = validation.faceDetected && validation.centered && validation.goodFraming;

  const validationItems = [
    { key: "faceDetected", label: "Face detected", icon: User, valid: validation.faceDetected },
    { key: "centered", label: "Face centered in frame", icon: Focus, valid: validation.centered },
    { key: "goodFraming", label: "Good framing & size", icon: Lightbulb, valid: validation.goodFraming },
  ];

  // Frame turns green when all conditions are met
  const frameColor = allValid ? "border-green-500" : "border-accent";
  const frameHint = allValid ? "Ready to capture!" : "Align your face inside the oval";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Camera/Preview Area */}
      <div className="relative bg-card rounded-3xl overflow-hidden shadow-card-lg mb-8">
        <div className="aspect-[3/4] relative">
          {!capturedImage ? (
            <>
              {isCameraLoading && (
                <div className="absolute inset-0 bg-card/95 flex items-center justify-center z-10">
                  <LoadingSpinner size="md" text="Initializing Camera..." />
                </div>
              )}
              {!isDemoMode && (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}
              {/* Face guide overlay */}
              {!isCameraLoading && !isDemoMode && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-48 h-60 border-4 rounded-full transition-colors duration-300 ${frameColor}`}>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium text-card-foreground bg-card/90 px-3 py-1 rounded-full whitespace-nowrap">
                      {frameHint}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <img
              src={capturedImage}
              alt="Captured photo"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Demo Mode Indicator */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl p-4 shadow-lg mb-8 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold">Demo Mode Active</h4>
              <p className="text-sm opacity-90">Using sample data for testing</p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Status */}
      {!capturedImage && (
        <div className="bg-card rounded-2xl p-6 shadow-card mb-8 animate-fade-in">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-secondary" />
            Photo Requirements
          </h3>
          <div className="space-y-3">
            {validationItems.map((item) => (
              <div
                key={item.key}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  item.valid ? "bg-green-500/10" : "bg-accent/10"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    item.valid ? "bg-green-500/20 text-green-600" : "bg-accent/20 text-accent"
                  }`}
                >
                  {item.valid ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <item.icon className="w-4 h-4" />
                  )}
                </div>
                <span className={`font-medium ${item.valid ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        {!capturedImage ? (
          <>
            <div className="flex gap-4">
              <Button
                variant="hero"
                size="xl"
                className="flex-1"
                onClick={capturePhoto}
                disabled={isCapturing || !allValid}
              >
                {isCapturing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Capturing...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-2" />
                    Take Photo
                  </>
                )}
              </Button>
            </div>
            <div className="relative flex items-center">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-sm text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border"></div>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={triggerFileUpload}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Photo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </>
        ) : (
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={retakePhoto}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake
            </Button>
            <Button
              variant="hero"
              size="lg"
              className="flex-1"
              onClick={confirmPhoto}
            >
              <Check className="w-5 h-5 mr-2" />
              Use This Photo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
