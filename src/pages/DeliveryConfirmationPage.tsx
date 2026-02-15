import { DeliveryConfirmation } from "@/components/DeliveryConfirmation";
import { usePhotoFlowState } from "@/hooks/usePhotoFlowState";
import { Navigation } from "@/components/Navigation";

export const DeliveryConfirmationPage = () => {
  const { state, updateState } = usePhotoFlowState();

  const handleConfirm = () => {
    updateState({ step: 5 });
    window.location.href = `${import.meta.env.BASE_URL}success`;
  };

  const handleBack = () => {
    updateState({ step: 3 });
    window.location.href = `${import.meta.env.BASE_URL}photo-variations`;
  };

  if (state.selectedVariation === null) {
    // Redirect to variations if no selection
    window.location.href = `${import.meta.env.BASE_URL}photo-variations`;
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLandingPage={false} />
      <div className="pt-20">
        <DeliveryConfirmation
          selectedVariation={state.selectedVariation}
          selectedVariationData={state.selectedVariationData}
          wantsPrint={state.wantsPrint}
          setWantsPrint={(wants) => updateState({ wantsPrint: wants })}
          deliveryAddress={state.deliveryAddress}
          setDeliveryAddress={(address) => updateState({ deliveryAddress: address })}
          onConfirm={handleConfirm}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};
