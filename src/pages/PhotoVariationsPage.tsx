import { PhotoVariations } from "@/components/PhotoVariations";
import { usePhotoFlowState } from "@/hooks/usePhotoFlowState";
import type { PhotoResult } from "@/hooks/use-photo-job";
import { Navigation } from "@/components/Navigation";
import { useTokenNavigation } from "@/hooks/useTokenNavigation";

export const PhotoVariationsPage = () => {
  const { state, updateState } = usePhotoFlowState();
  const { navigateWithToken } = useTokenNavigation();

  const handleSelectVariation = (index: number, variationData?: PhotoResult) => {
    updateState({
      selectedVariation: index,
      selectedVariationData: variationData || null,
      step: 4
    });
    navigateWithToken('/delivery-confirmation');
  };

  const handleBack = () => {
    updateState({ step: 2 });
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
        />
      </div>
    </div>
  );
};