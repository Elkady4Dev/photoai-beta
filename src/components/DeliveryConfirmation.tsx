import { Printer, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepHeader } from "@/components/StepHeader";
import { WatermarkOverlay } from "@/components/WatermarkOverlay";
import type { PhotoResult } from "@/hooks/use-photo-job";

interface DeliveryConfirmationProps {
  selectedVariation: number;
  selectedVariationData?: PhotoResult;
  wantsPrint: boolean;
  setWantsPrint: (wants: boolean) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  onConfirm: () => void;
  onBack: () => void;
}

export const DeliveryConfirmation = ({
  selectedVariation,
  selectedVariationData,
  wantsPrint,
  setWantsPrint,
  deliveryAddress,
  setDeliveryAddress,
  onConfirm,
  onBack,
}: DeliveryConfirmationProps) => {
  const canConfirm = !wantsPrint || (wantsPrint && deliveryAddress.trim().length > 10);

  return (
    <div className="min-h-screen bg-background">

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-xl mx-auto">
          {/* Selected photo preview */}
          <div className="bg-card rounded-2xl p-6 shadow-card mb-6 animate-fade-in">
            <h3 className="font-semibold text-foreground mb-4">Your Selected Photo</h3>
            <div className="relative aspect-[3/4] max-w-[200px] mx-auto rounded-xl overflow-hidden bg-muted">
              {selectedVariationData ? (
                <>
                  <img
                    src={selectedVariationData.imageDataUrl}
                    alt={`Selected variation ${selectedVariation + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <WatermarkOverlay />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span className="text-sm">Variation #{selectedVariation + 1}</span>
                </div>
              )}
            </div>
          </div>

          {/* Download option */}
          <div className="bg-card rounded-2xl p-6 shadow-card mb-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-soft/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Digital Download</h3>
                <p className="text-sm text-muted-foreground">
                  High-resolution photo ready for digital use
                </p>
              </div>
              <span className="text-lg font-bold text-secondary">Free</span>
            </div>
          </div>

          {/* Print option */}
          <div className="bg-card rounded-2xl p-6 shadow-card mb-6 animate-fade-in">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-soft/20 flex items-center justify-center flex-shrink-0">
                <Printer className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    id="print-option"
                    checked={wantsPrint}
                    onCheckedChange={setWantsPrint}
                    className="w-5 h-5"
                  />
                  <Label htmlFor="print-option" className="flex items-center gap-3 cursor-pointer group">
                    <div>
                      <span className="font-semibold text-foreground block group-hover:text-accent transition-colors">Print & Deliver</span>
                      <span className="text-sm text-muted-foreground">Professional prints mailed to you</span>
                    </div>
                  </Label>
                </div>
              </div>
            </div>

            {wantsPrint && (
              <div className="mt-6 pt-6 border-t border-border animate-slide-up">
                <Label htmlFor="address" className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Delivery Address
                </Label>
                <Input
                  id="address"
                  placeholder="Enter your full delivery address..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  Include street address, city, postal code, and country
                </p>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="bg-primary/5 rounded-2xl p-6 mb-8">
            <h4 className="font-semibold text-foreground mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Digital Photo</span>
                <span className="text-foreground">Included</span>
              </div>
              {wantsPrint && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Print & Delivery</span>
                  <span className="text-foreground">$9.99</span>
                </div>
              )}
              <div className="pt-2 mt-2 border-t border-border flex justify-between font-semibold">
                <span className="text-foreground">Total</span>
                <span className="text-accent">{wantsPrint ? "$9.99" : "Free"}</span>
              </div>
            </div>
          </div>

          <Button
            variant="hero"
            size="xl"
            className="w-full"
            onClick={onConfirm}
            disabled={!canConfirm}
          >
            {wantsPrint ? "Confirm & Pay" : "Confirm & Download"}
          </Button>
        </div>
      </div>
    </div>
  );
};
