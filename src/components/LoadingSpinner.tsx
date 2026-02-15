import React from "react";
import { Camera, Aperture } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  size = "md", 
  text = "Processing...", 
  className = "" 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-[3px] border-retro-dark rounded-full">
          <div className="absolute inset-0 border-[3px] border-t-retro-red border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        
        {/* Center camera icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-retro-cream border-[3px] border-retro-dark rounded-lg p-2 shadow-retro-sm">
            <Camera className={`${iconSizes[size]} text-retro-dark`} />
          </div>
        </div>
      </div>
      
      {text && (
        <div className="text-center">
          <div className="flex items-center gap-2">
            <Aperture className="w-4 h-4 text-retro-dark animate-pulse" />
            <span className="font-display text-sm text-retro-dark tracking-wider uppercase">
              {text}
            </span>
            <Aperture className="w-4 h-4 text-retro-dark animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};

// Loading skeleton for cards
export const LoadingSkeleton = ({ 
  lines = 3, 
  className = "" 
}: { 
  lines?: number; 
  className?: string; 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="bg-retro-cream/50 border-[2px] border-retro-dark/20 rounded-lg animate-pulse"
          style={{ 
            height: i === 0 ? "2rem" : "1rem", 
            width: i === 0 ? "75%" : "100%" 
          }}
        />
      ))}
    </div>
  );
};

// Full page loading overlay
export const LoadingOverlay = ({ 
  show = true, 
  text = "Loading..." 
}: { 
  show?: boolean; 
  text?: string; 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-retro-cream/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};
