import { Check, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { DocumentType } from "@/pages/Index";

interface DocumentTypeSelectionProps {
  onSelect: (type: DocumentType) => void;
  onBack: () => void;
}

const documentTypes = [
  {
    id: "passport" as DocumentType,
    title: "4 x 6",
    size: "4\" x 6\"",
    description: "Standard passport & travel document photo. White background required.",
    requirements: [
      "Face centered and visible",
      "Neutral expression",
      "No glasses or headwear",
      "White/light gray background",
    ],
    guide: [
      { name: "Egyptian Passport", size: "4 x 6" },
      { name: "US Passport", size: "2 x 2" },
      { name: "UK Passport", size: "35 x 45 mm" },
    ]
  },
  {
    id: "visa" as DocumentType,
    title: "2 x 2",
    size: "2\" x 2\"",
    description: "Square format for visa applications. Plain white background required.",
    requirements: [
      "Full face, front view",
      "Eyes open and visible",
      "Plain white background",
      "Recent photo (within 6 months)",
    ],
    guide: [
      { name: "US Visa", size: "2 x 2" },
      { name: "Schengen Visa", size: "35 x 45 mm" },
    ]
  },
  {
    id: "id" as DocumentType,
    title: "Wallet Size",
    size: "2.5\" x 3.5\"",
    description: "Standard wallet/ID card size. Suitable for national IDs and employee badges.",
    requirements: [
      "Clear facial features",
      "Proper lighting",
      "Solid background",
      "No shadows on face",
    ],
    guide: [
      { name: "National ID", size: "2.5 x 3.5" },
      { name: "Employee Badge", size: "2 x 3" },
    ]
  },
];

export const DocumentTypeSelection = ({ onSelect, onBack }: DocumentTypeSelectionProps) => {
  const [showGuides, setShowGuides] = useState<{ [key: string]: boolean }>({});

  const toggleGuide = (id: string) => {
    setShowGuides(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <p className="text-center text-muted-foreground mb-8">
            Choose the photo size you need. Each has specific dimensions and requirements.
          </p>

          {/* Back Button */}
          <div className="flex justify-center mb-8">
            <Button
              variant="outline"
              size="lg"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <div className="space-y-4">
            {documentTypes.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onSelect(doc.id)}
                className="w-full bg-card rounded-2xl p-6 shadow-card hover:shadow-card-lg transition-all duration-300 text-left group hover:scale-[1.01] active:scale-[0.99]"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center flex-shrink-0">
                    <Check className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                    <div className="space-y-1">
                      {doc.requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Guide toggle button - visible on all screen sizes */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGuide(doc.id);
                      }}
                      className="flex items-center gap-2 text-xs lg:hidden"
                    >
                      {showGuides[doc.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {showGuides[doc.id] ? "Hide" : "Show"} Uses
                    </Button>
                    {/* Desktop toggle - smaller and inline */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleGuide(doc.id);
                      }}
                      className="hidden lg:flex items-center gap-1 text-xs hover:bg-muted/50"
                    >
                      {showGuides[doc.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      {showGuides[doc.id] ? "Hide" : "Show"}
                    </Button>
                  </div>

                  {/* Guide content - responsive */}
                  <div className={`${showGuides[doc.id] ? 'block' : 'hidden'} lg:block lg:flex-shrink-0 lg:w-48 ${!showGuides[doc.id] ? 'lg:hidden' : ''}`}>
                    <div className="bg-muted/50 rounded-lg p-3 border border-border mt-4 lg:mt-0">
                      <h4 className="font-medium text-foreground text-sm mb-2">Common Uses:</h4>
                      <div className="space-y-1">
                        {doc.guide.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">{item.name}</span>
                            <span className="font-medium text-foreground">{item.size}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
  );
};
