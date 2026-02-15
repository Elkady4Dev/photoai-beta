import { PhotoVariations } from "@/components/PhotoVariations";
import { usePhotoFlowState } from "@/hooks/usePhotoFlowState";
import type { PhotoResult } from "@/hooks/use-photo-job";
import { Navigation } from "@/components/Navigation";

export const PhotoVariationsPage = () => {
  const { state, updateState } = usePhotoFlowState();

  const handleSelectVariation = (index: number, variationData?: PhotoResult) => {
    const updates = { 
      selectedVariation: index, 
      selectedVariationData: variationData || null,
      step: 4 
    };
    updateState(updates);
    
    // Manually flush to localStorage before hard navigation
    const current = JSON.parse(localStorage.getItem('photoFlowState') || '{}');
    localStorage.setItem('photoFlowState', JSON.stringify({ ...current, ...updates }));
    
    window.location.href = `${import.meta.env.BASE_URL}delivery-confirmation`;
  };

  const handleBack = () => {
    const updates = { step: 2 };
    updateState(updates);
    
    const current = JSON.parse(localStorage.getItem('photoFlowState') || '{}');
    localStorage.setItem('photoFlowState', JSON.stringify({ ...current, ...updates }));
    
    window.location.href = `${import.meta.env.BASE_URL}document-type`;
  };

  if (!state.documentType || !state.capturedPhoto) {
    // Redirect to capture if missing required data
    window.location.href = `${import.meta.env.BASE_URL}photo-capture`;
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLandingPage={false} />
      <div className="pt-20">
        <PhotoVariations
          documentType={state.documentType}
          originalPhoto={state.capturedPhoto}
          onSelectVariation={handleSelectVariation}
          onBack={handleBack}
          isDemoMode={state.isDemoMode}
        />
      </div>
    </div>
  );
};
