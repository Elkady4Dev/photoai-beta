import { SuccessPage } from "@/components/SuccessPage";
import { usePhotoFlowState } from "@/hooks/usePhotoFlowState";
import { Navigation } from "@/components/Navigation";

export const SuccessPageRoute = () => {
  const { state, resetState } = usePhotoFlowState();

  const handleBack = () => {
    // Go back to delivery confirmation
    window.location.href = `${import.meta.env.BASE_URL}delivery-confirmation`;
  };

  const handleStartOver = () => {
    resetState();
    window.location.href = `${import.meta.env.BASE_URL}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLandingPage={false} />
      <div className="pt-20">
        <SuccessPage
          wantsPrint={state.wantsPrint}
          onStartOver={handleStartOver}
          onBack={handleBack}
          selectedVariationData={state.selectedVariationData}
        />
      </div>
    </div>
  );
};
