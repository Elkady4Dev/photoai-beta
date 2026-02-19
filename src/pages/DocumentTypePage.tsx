import { DocumentTypeSelection } from "@/components/DocumentTypeSelection";
import { usePhotoFlowState } from "@/hooks/usePhotoFlowState";
import { Navigation } from "@/components/Navigation";
import { useTokenNavigation } from "@/hooks/useTokenNavigation";

export const DocumentTypePage = () => {
  const { state, updateState } = usePhotoFlowState();
  const { navigateWithToken } = useTokenNavigation();

  const handleSelect = (type: "passport" | "visa" | "id") => {
    updateState({ documentType: type, step: 3 });
    navigateWithToken('/photo-variations');
  };

  const handleBack = () => {
    updateState({ step: 1 });
    navigateWithToken('/photo-capture');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLandingPage={false} />
      <div className="pt-20">
        <DocumentTypeSelection
          onSelect={handleSelect}
          onBack={handleBack}
        />
      </div>
    </div>
  );
};