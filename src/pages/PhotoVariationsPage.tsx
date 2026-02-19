import { PhotoVariations } from "@/components/PhotoVariations";
import { usePhotoFlowState } from "@/hooks/usePhotoFlowState";
import type { PhotoResult } from "@/hooks/use-photo-job";
import { Navigation } from "@/components/Navigation";
import { useTokenNavigation } from "@/hooks/useTokenNavigation";

export const PhotoVariationsPage = () => {
  const { state, updateState } = usePhotoFlowState();
  const { navigateWithToken } = useTokenNavigation();

  const handleSelectVariation = (index: number, variationData?: PhotoResult) => {
    const updates = { 
      selectedVariation: index, 
      selectedVariationData: variationData || null,
      step: 4 
    };
    updateState(updates);
    
    const current = JSON.parse(localStorage.getItem('photoFlowState') || '{}');
    localStorage.setItem('photoFlowState', JSON.stringify({ ...current, ...updates }));
    
    // Single navigation — no window.location.href
    navigateWithToken('/delivery-confirmation');
  };

  const handleBack = () => {
    const updates = { step: 2 };
    updateState(updates);
    
    const current = JSON.parse(localStorage.getItem('photoFlowState') || '{}');
    localStorage.setItem('photoFlowState', JSON.stringify({ ...current, ...updates }));
    
    navigateWithToken('/document-type');
  };

  if (!state.documentType || !state.capturedPhoto) {
    navigateWithToken('/photo-capture');
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