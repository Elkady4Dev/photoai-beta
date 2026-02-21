import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, RotateCcw, Check, AlertCircle, Lightbulb, Focus, Upload, User, X, Sparkles, Zap, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, LoadingOverlay } from "@/components/LoadingSpinner";

interface PhotoCaptureProps {
  onPhotoCapture: (imageDataUrl: string) => void;
  onBack: () => void;
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

export const PhotoCapture = ({ onPhotoCapture, onBack }: PhotoCaptureProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    faceDetected: false,
    centered: false,
    goodFraming: false,
  });
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

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
    if (!capturedImage) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [capturedImage, startCamera, stopCamera]);

  // ---- Capture / Retake / Upload ----
  const capturePhoto = () => {
    setIsCapturing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // Flip horizontally to match the mirrored preview
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.95);
      setCapturedImage(imageData);
      stopCamera();
    }
    setTimeout(() => setIsCapturing(false), 500);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    // Create image using document.createElement to avoid TypeScript issues
    const img = document.createElement('img');
    img.onload = () => {
      console.log('Image loaded:', img.width, 'x', img.height);
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
      console.log('Image processed and set as captured image');
    };
    img.onerror = (error) => {
      console.error('Error loading image:', error);
    };
    img.src = URL.createObjectURL(file);
  };

  const triggerFileUpload = () => {
    console.log('Triggering file upload...');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('File input ref is null');
    }
  };

  const openGallery = () => {
    // Load images from localStorage or recent captures
    const savedImages = localStorage.getItem('galleryImages');
    if (savedImages) {
      setGalleryImages(JSON.parse(savedImages));
    }
    // For now, just trigger file upload as gallery
    triggerFileUpload();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      // Save to gallery
      const updatedGallery = [...galleryImages, capturedImage];
      setGalleryImages(updatedGallery);
      localStorage.setItem('galleryImages', JSON.stringify(updatedGallery));
      onPhotoCapture(capturedImage);
    }
  };

  const allValid = validation.faceDetected && validation.centered && validation.goodFraming;

  const validationItems = [
    { key: "faceDetected", label: "Face detected", icon: User, valid: validation.faceDetected },
    { key: "centered", label: "Face centered", icon: Focus, valid: validation.centered },
    { key: "goodFraming", label: "Good framing", icon: Lightbulb, valid: validation.goodFraming },
  ];

  // Frame turns green when all conditions are met
  const frameColor = allValid ? "border-retro-teal" : "border-retro-dark/50";
  const frameHint = allValid ? "Perfect! 📸" : "Center your face";

  return (
    <div className="min-h-screen bg-retro-cream/50 grain-overlay relative">
      {/* Full Screen Camera View */}
      <div className="fixed inset-0 bg-black">
        <div className="relative h-full w-full">
          {!capturedImage ? (
            <>
              {/* Camera Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              
              {/* Loading Overlay */}
              {isCameraLoading && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                  <div className="text-center">
                    <LoadingSpinner size="lg" text="Starting Camera..." />
                  </div>
                </div>
              )}

              {/* Face Guide Overlay */}
              {!isCameraLoading && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div className={`relative`}>
                    {/* Retro Oval Frame */}
                    <div className={`w-64 h-80 border-[6px] ${frameColor} rounded-full transition-all duration-300 shadow-retro-lg`}>
                      {/* Corner decorations */}
                      <div className="absolute -top-4 -left-4 w-8 h-8 bg-retro-red border-[3px] border-retro-dark rounded-lg shadow-retro-sm" />
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-retro-mustard border-[3px] border-retro-dark rounded-lg shadow-retro-sm" />
                      <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-retro-teal border-[3px] border-retro-dark rounded-lg shadow-retro-sm" />
                      <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-retro-red border-[3px] border-retro-dark rounded-lg shadow-retro-sm" />
                    </div>
                    
                    {/* Status Badge */}
                    <div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border-[3px] transition-all duration-300 ${
                      allValid 
                        ? "bg-retro-teal border-retro-teal text-retro-cream shadow-retro-sm" 
                        : "bg-retro-cream border-retro-dark text-retro-dark shadow-retro-sm"
                    }`}>
                      <span className="font-display text-sm font-bold tracking-wider">
                        {frameHint}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Top Controls */}
              <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30">
                {/* Back Button */}
                <button
                  onClick={onBack}
                  className="w-12 h-12 bg-retro-cream/90 backdrop-blur-sm border-[3px] border-retro-dark rounded-lg flex items-center justify-center shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
                >
                  <X className="w-6 h-6 text-retro-dark" />
                </button>

                {/* Validation Status */}
                <div className="flex gap-2">
                  {validationItems.map((item, index) => (
                    <div
                      key={item.key}
                      className={`w-10 h-10 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 ${
                        item.valid
                          ? "bg-retro-teal border-retro-teal shadow-retro-sm"
                          : "bg-retro-cream/50 border-retro-dark/50"
                      }`}
                    >
                      {item.valid ? (
                        <Check className="w-5 h-5 text-retro-cream" />
                      ) : (
                        <item.icon className="w-5 h-5 text-retro-dark" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Upload Button */}
                <button
                  onClick={triggerFileUpload}
                  className="w-12 h-12 bg-retro-mustard/90 backdrop-blur-sm border-[3px] border-retro-dark rounded-lg flex items-center justify-center shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
                >
                  <Upload className="w-6 h-6 text-retro-dark" />
                </button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-30">
                <div className="flex items-center justify-center gap-8">
                  {/* Gallery Button */}
                  <button
                    onClick={openGallery}
                    className="w-14 h-14 bg-retro-cream/90 backdrop-blur-sm border-[3px] border-retro-dark rounded-lg flex items-center justify-center shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 relative"
                  >
                    <Image className="w-6 h-6 text-retro-dark" />
                    {galleryImages.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-retro-red border-[2px] border-retro-cream rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-retro-cream">{galleryImages.length}</span>
                      </div>
                    )}
                  </button>

                  {/* Capture Button - Centered */}
                  <div className="flex-1 flex justify-center">
                    <button
                      onClick={capturePhoto}
                      disabled={isCapturing || !allValid}
                      className={`relative w-24 h-24 rounded-full border-[6px] transition-all duration-300 flex items-center justify-center ${
                        allValid && !isCapturing
                          ? "bg-retro-red border-retro-red shadow-retro-lg hover:shadow-retro-hover hover:translate-x-[2px] hover:translate-y-[2px] animate-pulse"
                          : "bg-retro-dark/50 border-retro-dark/50"
                      }`}
                    >
                      {isCapturing ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 bg-retro-cream rounded-full animate-ping" />
                        </div>
                      ) : (
                        <Camera className={`w-10 h-10 ${allValid ? "text-retro-cream" : "text-retro-dark/50"}`} />
                      )}
                    </button>
                  </div>

                  {/* Empty space for balance */}
                  <div className="w-14 h-14" />
                </div>

                {/* Fun Tips */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 bg-retro-cream/90 backdrop-blur-sm border-[3px] border-retro-dark rounded-lg px-4 py-2 shadow-retro-sm">
                    <Sparkles className="w-4 h-4 text-retro-dark" />
                    <span className="font-display text-sm text-retro-dark tracking-wider">
                      {allValid ? "Looking great! 📸" : "Move closer to the guide"}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Captured Image Preview */}
              <img
                src={capturedImage}
                alt="Captured photo"
                className="w-full h-full object-cover"
              />

              {/* Top Controls for Preview */}
              <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-30">
                <button
                  onClick={retakePhoto}
                  className="w-12 h-12 bg-retro-cream/90 backdrop-blur-sm border-[3px] border-retro-dark rounded-lg flex items-center justify-center shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
                >
                  <RotateCcw className="w-6 h-6 text-retro-dark" />
                </button>

                <div className="sticker bg-retro-teal border-[3px] border-retro-teal rounded-lg px-4 py-2 shadow-retro-sm">
                  <span className="font-display text-sm text-retro-cream font-bold tracking-wider">
                    Photo Captured!
                  </span>
                </div>

                <button
                  onClick={confirmPhoto}
                  className="w-12 h-12 bg-retro-red/90 backdrop-blur-sm border-[3px] border-retro-red rounded-lg flex items-center justify-center shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
                >
                  <Check className="w-6 h-6 text-retro-cream" />
                </button>
              </div>

              {/* Bottom Controls for Preview */}
              <div className="absolute bottom-0 left-4 right-4 p-4 z-30">
                <div className="flex gap-3 max-w-xs mx-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 border-[3px] border-retro-dark bg-retro-cream/90 backdrop-blur-sm hover:bg-retro-dark hover:text-retro-cream"
                    onClick={retakePhoto}
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Retake
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    className="flex-1"
                    onClick={confirmPhoto}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Use This
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hidden Elements */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};