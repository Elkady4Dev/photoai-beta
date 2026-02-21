import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle, Mail, Phone, Shield, Clock, Camera, CreditCard, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ComponentType<any>;
}

export const FAQPage = () => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const faqData: FAQItem[] = [
    {
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer'),
      category: "Technology",
      icon: Camera
    },
    {
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer'),
      category: "Requirements",
      icon: Shield
    },
    {
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer'),
      category: "Delivery",
      icon: Clock
    },
    {
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer'),
      category: "Privacy",
      icon: Shield
    },
    {
      question: t('faq.q5.question'),
      answer: t('faq.q5.answer'),
      category: "Features",
      icon: Camera
    },
    {
      question: t('faq.q6.question'),
      answer: t('faq.q6.answer'),
      category: "Payment",
      icon: CreditCard
    },
    {
      question: t('faq.q7.question'),
      answer: t('faq.q7.answer'),
      category: "Guarantee",
      icon: Award
    },
    {
      question: t('faq.q8.question'),
      answer: t('faq.q8.answer'),
      category: "Delivery",
      icon: Clock
    }
  ];

  const filteredFAQs = faqData; // Show all FAQs without filtering

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        // Clear all other expanded items and only expand the clicked one
        newSet.clear();
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen grain-overlay bg-retro-cream/50">
      <Navigation isLandingPage={false} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-retro-red border-[3px] border-retro-dark rounded-lg px-4 py-1.5 shadow-retro-sm mb-6">
              <HelpCircle className="w-4 h-4 text-retro-cream" />
              <span className="font-display text-sm tracking-wider text-retro-cream">FAQ</span>
            </div>
            
            <h1 className="font-display text-[3rem] md:text-[4.5rem] text-retro-dark leading-[0.9] mb-6 tracking-tight">
              {t('faq.title')}
              <br />
              <span className="font-display-serif italic text-retro-red text-[2rem] md:text-[3rem]">
                {t('faq.subtitle')}
              </span>
            </h1>
            
            <p className="text-retro-dark-mid text-lg max-w-2xl mx-auto font-medium mb-12">
              {t('faq.description')}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {filteredFAQs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`sticker rounded-xl p-6 hover:shadow-retro-hover transition-all duration-300 ${
                    faq.category === "Technology"
                      ? "bg-retro-teal/10 border-[2px] border-retro-teal"
                      : faq.category === "Requirements"
                      ? "bg-retro-red/10 border-[2px] border-retro-red"
                      : faq.category === "Delivery"
                      ? "bg-retro-mustard/10 border-[2px] border-retro-mustard"
                      : faq.category === "Guarantee"
                      ? "bg-retro-pink/10 border-[2px] border-retro-pink"
                      : faq.category === "Privacy"
                      ? "bg-retro-olive/10 border-[2px] border-retro-olive"
                      : faq.category === "Features"
                      ? "bg-retro-orange/10 border-[2px] border-retro-orange"
                      : faq.category === "Payment"
                      ? "bg-retro-burgundy/10 border-[2px] border-retro-burgundy"
                      : "bg-retro-brown/10 border-[2px] border-retro-brown"
                  }`}
                >
                  {/* Question */}
                  <button
                    onClick={() => toggleExpand(index)}
                    className="w-full text-left flex items-start gap-4 group"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-retro-sm ${
                        faq.category === "Technology"
                          ? "bg-retro-teal border-[3px] border-retro-teal"
                          : faq.category === "Requirements"
                          ? "bg-retro-red border-[3px] border-retro-red"
                          : faq.category === "Delivery"
                          ? "bg-retro-mustard border-[3px] border-retro-mustard"
                          : faq.category === "Guarantee"
                          ? "bg-retro-pink border-[3px] border-retro-pink"
                          : faq.category === "Privacy"
                          ? "bg-retro-olive border-[3px] border-retro-olive"
                          : faq.category === "Features"
                          ? "bg-retro-orange border-[3px] border-retro-orange"
                          : faq.category === "Payment"
                          ? "bg-retro-burgundy border-[3px] border-retro-burgundy"
                          : "bg-retro-brown border-[3px] border-retro-brown"
                      }`}>
                        <faq.icon className="w-6 h-6 text-retro-cream" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-lg text-retro-dark mb-2">{faq.question}</h3>
                        <div className="flex items-center gap-2 text-retro-dark-mid">
                          <span className="text-xs font-black uppercase tracking-wider">
                            {faq.category}
                          </span>
                          {expandedItems.has(index) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Answer */}
                  <div className={`overflow-hidden transition-all duration-300 ${
                    expandedItems.has(index) ? "max-h-96" : "max-h-0"
                  }`}>
                    <div className="p-4 text-retro-dark-mid leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still Need Help? */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="sticker bg-retro-dark rounded-xl p-8 shadow-retro-lg">
              <h3 className="font-display text-2xl text-retro-cream mb-4">
                {t('faq.stillNeedHelp')}
              </h3>
              <p className="text-retro-cream/70 text-base mb-6 leading-relaxed">
                {t('faq.stillNeedHelpDesc')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/contact')}
                  className="w-full sm:w-auto border-[2px] border-retro-cream hover:bg-retro-cream hover:text-retro-dark text-retro-cream"
                >
                  <Mail className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('faq.emailSupport')}
                </Button>
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={() => navigate('/contact')}
                  className="w-full sm:w-auto"
                >
                  <Phone className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('faq.callUs')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
