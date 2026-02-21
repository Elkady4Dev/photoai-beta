import React from "react";
import { Home, ArrowLeft, Camera, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen grain-overlay bg-retro-cream">
      <Navigation />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Badge */}
          <div className="inline-flex items-center gap-3 bg-retro-red border-[3px] border-retro-dark rounded-lg px-6 py-3 shadow-retro-lg mb-8">
            <AlertTriangle className="w-6 h-6 text-retro-cream" />
            <span className="font-display text-2xl text-retro-cream tracking-wider">ERROR 404</span>
          </div>

          {/* Main Message */}
          <h1 className="font-display text-[4rem] md:text-[6rem] text-retro-dark leading-[0.9] mb-6 tracking-tight">
            PHOTO
            <br />
            <span className="text-retro-red font-display-serif italic text-[3rem] md:text-[4.5rem]">
              Not Found
            </span>
          </h1>

          {/* Description */}
          <p className="text-retro-dark-mid text-lg mb-12 max-w-md mx-auto leading-relaxed font-medium">
            Oops! The photo you're looking for seems to have vanished into the darkroom. 
            Let's get you back to snapping perfect ID photos.
          </p>

          {/* Retro Camera Illustration */}
          <div className="relative w-48 h-48 mx-auto mb-12">
            <div className="w-full h-full bg-retro-teal/10 border-[3px] border-retro-dark rounded-xl flex items-center justify-center relative">
              <div className="w-20 h-20 bg-retro-teal border-[3px] border-retro-dark rounded-lg flex items-center justify-center shadow-retro-sm">
                <Camera className="w-10 h-10 text-retro-cream" />
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-retro-mustard border-[2px] border-retro-dark rounded-full" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-retro-red border-[2px] border-retro-dark rounded-sm rotate-45" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={handleGoHome}
              className="flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
            
            <button
              className="flex items-center gap-3 group border-[3px] border-retro-dark rounded-lg px-6 py-3 bg-retro-cream shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150"
              onClick={() => navigate(-1)}
            >
              <div className="w-8 h-8 bg-retro-dark rounded-md flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 text-retro-cream" />
              </div>
              <span className="text-sm font-black uppercase tracking-wider text-retro-dark">Go Back</span>
            </button>
          </div>

          {/* Fun retro message */}
          <div className="mt-16 p-6 bg-retro-mustard/10 border-[2px] border-retro-dark/20 rounded-lg">
            <p className="font-display text-sm text-retro-dark-mid text-center">
              <span className="font-black">FUN FACT:</span> In the early days of photography, 
              exposure times could last up to several minutes. 
              Good thing our AI works instantly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
