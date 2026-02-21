import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  onBack: () => void;
}

export const StepHeader = ({ step, totalSteps, title, onBack }: StepHeaderProps) => {
  return (
    <header className="bg-retro-dark text-retro-cream py-6 sticky top-0 z-50 border-b-[3px] border-retro-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-retro-cream hover:bg-retro-cream hover:text-retro-dark border-[2px] border-retro-cream"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="font-display text-xl font-semibold">{title}</h1>
            <p className="text-sm text-retro-cream/80">Step {step} of {totalSteps}</p>
          </div>

          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-retro-cream/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-retro-teal transition-all duration-500"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </header>
  );
};
