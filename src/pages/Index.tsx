import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { usePhotoFlowState } from "@/hooks/usePhotoFlowState";

export type DocumentType = "passport" | "visa" | "id";

export interface AppState {
  step: number;
  capturedPhoto: string | null;
  documentType: DocumentType | null;
  selectedVariation: number | null;
  wantsPrint: boolean;
  deliveryAddress: string;
  isDemoMode: boolean;
}

const Index = () => {
  // Read ?access= token from URL and persist to localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access');
    if (token) {
      localStorage.setItem(
        'tester_auth',
        JSON.stringify({ token, expiresAt: Date.now() + 24 * 60 * 60 * 1000 })
      );
    }
  }, []);

  const { state, updateState } = usePhotoFlowState();

  const handleGetStarted = () => {
    // Navigate to photo capture route with base path
    window.location.href = `${import.meta.env.BASE_URL}photo-capture`;
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingPage 
        onGetStarted={handleGetStarted} 
        isDemoMode={state.isDemoMode}
        toggleDemoMode={() => updateState({ isDemoMode: !state.isDemoMode })}
      />
    </div>
  );
};

export default Index;
