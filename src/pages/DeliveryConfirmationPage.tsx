import { DeliveryConfirmation } from "@/components/DeliveryConfirmation";
import { usePhotoFlowState } from "@/hooks/usePhotoFlowState";
import { Navigation } from "@/components/Navigation";
import { useTokenNavigation } from "@/hooks/useTokenNavigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const DeliveryConfirmationPage = () => {
  const { state, updateState } = usePhotoFlowState();
  const { navigateWithToken } = useTokenNavigation();
  const { user } = useAuth();

  const handleConfirm = async () => {
    if (user && state.selectedVariationData) {
      const { imageDataUrl, filename, photoType } = state.selectedVariationData;

      // Strip the "data:image/...;base64," prefix to store raw base64
      const base64 = imageDataUrl.includes(',')
        ? imageDataUrl.split(',')[1]
        : imageDataUrl;

      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        photo_type: photoType ?? state.documentType ?? 'unknown',
        variation_id: state.selectedVariation ?? 0,
        image_data: base64,
        filename,
        wants_print: state.wantsPrint,
        delivery_address: state.deliveryAddress.trim() || null,
        status: 'completed',
      });

      if (error) {
        console.error('[DeliveryConfirmationPage] Failed to save order:', error);
      }
    }

    updateState({ step: 5 });
    navigateWithToken('/success');
  };

  const handleBack = () => {
    updateState({ step: 3 });
    navigateWithToken('/photo-variations');
  };

  if (state.selectedVariation === null) {
    navigateWithToken('/photo-variations');
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