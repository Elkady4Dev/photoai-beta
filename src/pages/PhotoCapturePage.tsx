import { PhotoCapture } from "@/components/PhotoCapture";
import { usePhotoFlowState } from "@/hooks/usePhotoFlowState";
import { Navigation } from "@/components/Navigation";

export const PhotoCapturePage = () => {
  const { state, updateState } = usePhotoFlowState();

  const handlePhotoCapture = (photo: string) => {
    const updates = { capturedPhoto: photo, step: 2 };
    updateState(updates);

    // Manually flush to localStorage before hard navigation
    const current = JSON.parse(localStorage.getItem('photoFlowState') || '{}');
    localStorage.setItem('photoFlowState', JSON.stringify({ ...current, ...updates }));

    window.location.href = `${import.meta.env.BASE_URL}document-type`;
  };

  const handleBack = () => {
    const updates = { step: 0 };
    updateState(updates);

    const current = JSON.parse(localStorage.getItem('photoFlowState') || '{}');
    localStorage.setItem('photoFlowState', JSON.stringify({ ...current, ...updates }));

    window.location.href = `${import.meta.env.BASE_URL}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLandingPage={false} />
      <div className="pt-20">
        <PhotoCapture
          onPhotoCapture={handlePhotoCapture}
          onBack={handleBack}
          isDemoMode={state.isDemoMode}
        />
      </div>
    </div>
  );
};
