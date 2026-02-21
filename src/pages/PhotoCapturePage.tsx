import { PhotoCapture } from "@/components/PhotoCapture";
import { usePhotoFlowState } from "@/hooks/usePhotoFlowState";
import { Navigation } from "@/components/Navigation";
import { useTokenNavigation } from '@/hooks/useTokenNavigation';

export const PhotoCapturePage = () => {
  const { state, updateState } = usePhotoFlowState();
  const { navigateWithToken } = useTokenNavigation();

  const handlePhotoCapture = (photo: string) => {
    updateState({ capturedPhoto: photo, step: 2 });
    navigateWithToken('/document-type');
  };

  const handleBack = () => {
    updateState({ step: 0 });
    navigateWithToken('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLandingPage={false} />
      <div className="pt-20">
        <PhotoCapture
          onPhotoCapture={handlePhotoCapture}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};