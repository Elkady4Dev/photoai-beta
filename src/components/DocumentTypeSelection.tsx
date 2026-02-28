import { Check, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { DocumentType } from "@/pages/Index";
import { useLanguage } from "@/contexts/LanguageContext";

interface DocumentTypeSelectionProps {
  onSelect: (type: DocumentType) => void;
  onBack: () => void;
}

export const DocumentTypeSelection = ({ onSelect, onBack }: DocumentTypeSelectionProps) => {
  const { t, isRTL } = useLanguage();
  const [showGuides, setShowGuides] = useState<{ [key: string]: boolean }>({});

  const documentTypes = [
    {
      id: "passport" as DocumentType,
      title: t('docType.passport'),
      size: "4\" x 6\"",
      description: t('docType.passportDesc'),
      requirements: [
        t('docType.passportReqFace'),
        t('docType.passportReqExpression'),
        t('docType.passportReqBackground'),
        t('docType.passportReqGlasses'),
      ],
      guide: [
        { name: t('docType.egyptianPassport'), size: "4 x 6" },
        { name: t('docType.usPassport'), size: "2 x 2" },
        { name: t('docType.ukPassport'), size: "35 x 45 mm" },
      ]
    },
    {
      id: "visa" as DocumentType,
      title: t('docType.visa'),
      size: "2\" x 2\"",
      description: t('docType.visaDesc'),
      requirements: [
        t('docType.visaReqFace'),
        t('docType.visaReqEyes'),
        t('docType.visaReqBackground'),
        t('docType.visaReqRecent'),
      ],
      guide: [
        { name: t('docType.usVisa'), size: "2 x 2" },
        { name: t('docType.schengenVisa'), size: "35 x 45 mm" },
      ]
    },
    {
      id: "id" as DocumentType,
      title: t('docType.id'),
      size: "2.5\" x 3.5\"",
      description: t('docType.idDesc'),
      requirements: [
        t('docType.idReqClear'),
        t('docType.idReqLighting'),
        t('docType.idReqBackground'),
        t('docType.idReqShadows'),
      ],
      guide: [
        { name: t('docType.nationalId'), size: "2.5 x 3.5" },
        { name: t('docType.employeeBadge'), size: "2 x 3" },
      ]
    },
  ];

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
            {t('docType.selectPhotoSize')}
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
              {t('nav.back')}
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
                      {showGuides[doc.id] ? t('docType.hide') : t('docType.show')} {t('docType.uses')}
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
                      <h4 className="font-medium text-foreground text-sm mb-2">{t('docType.commonUses')}</h4>
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
