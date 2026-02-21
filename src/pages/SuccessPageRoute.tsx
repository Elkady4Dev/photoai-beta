import { SuccessPage } from "@/components/SuccessPage";
import { usePhotoFlowState } from "@/hooks/usePhotoFlowState";
import { Navigation } from "@/components/Navigation";
import { useTokenNavigation } from "@/hooks/useTokenNavigation";

export const SuccessPageRoute = () => {
  const { state, resetState } = usePhotoFlowState();
  const { navigateWithToken } = useTokenNavigation();

  const handleBack = () => {
    navigateWithToken('/delivery-confirmation');
  };

  const handleStartOver = () => {
    resetState();
    navigateWithToken('/');
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
