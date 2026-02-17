import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, HelpCircle, Mail, Phone, Shield, Clock, Camera } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ComponentType<any>;
}

const faqData: FAQItem[] = [
  {
    question: "How does AI-powered photo enhancement work?",
    answer: "Our AI technology automatically adjusts lighting, removes backgrounds, and optimizes your photo to meet standard requirements. It uses advanced algorithms to detect faces and ensure perfect positioning.",
    category: "Technology",
    icon: Camera
  },
  {
    question: "What countries' photo requirements do you support?",
    answer: "We support over 150 countries including USA, UK, Canada, Australia, Germany, France, and many more. Each photo size is optimized for specific country requirements.",
    category: "Requirements",
    icon: Shield
  },
  {
    question: "How quickly will I receive my photos?",
    answer: "Instant delivery! Once processed, your photos are available for immediate download. Print delivery takes 2-5 business days depending on your location.",
    category: "Delivery",
    icon: Clock
  },
  {
    question: "Is my data secure and private?",
    answer: "Absolutely! All photos are encrypted during processing and automatically deleted from our servers after 24 hours. We never store your personal information longer than necessary.",
    category: "Privacy",
    icon: Shield
  },
  {
    question: "Can I use photos taken with other cameras?",
    answer: "Yes! You can upload existing photos taken with any device. Our AI will optimize them to meet the required specifications for your photo size.",
    category: "Features",
    icon: Camera
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Mastercard, American Express), PayPal, and digital wallets like Apple Pay and Google Pay.",
    category: "Payment",
    icon: HelpCircle
  },
  {
    question: "Do you offer bulk discounts for businesses?",
    answer: "Yes! We offer special pricing for businesses needing multiple photos. Contact our sales team for custom enterprise solutions.",
    category: "Pricing",
    icon: HelpCircle
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach our support team via email at support@photoid.pro, through our contact form, or by phone at 1-800-PHOTO-ID during business hours.",
    category: "Support",
    icon: Phone
  }
];

export const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const categories = ["all", "Technology", "Requirements", "Delivery", "Guarantee", "Privacy", "Features", "Payment", "Pricing", "Support"];

  const filteredFAQs = activeCategory === "all" 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
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
              FREQUENTLY ASKED
              <br />
              <span className="font-display-serif italic text-retro-red text-[2rem] md:text-[3rem]">
                Questions
              </span>
            </h1>
            
            <p className="text-retro-dark-mid text-lg max-w-2xl mx-auto font-medium mb-12">
              Find answers to common questions about our AI-powered ID photo service.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg border-[2px] font-display text-sm tracking-wider transition-all duration-150 ${
                    activeCategory === category
                      ? category === "all" 
                        ? "bg-retro-dark text-retro-cream border-retro-dark"
                        : category === "Technology"
                        ? "bg-retro-teal text-retro-cream border-retro-teal"
                        : category === "Requirements"
                        ? "bg-retro-red text-retro-cream border-retro-red"
                        : category === "Delivery"
                        ? "bg-retro-mustard text-retro-dark border-retro-mustard"
                        : category === "Guarantee"
                        ? "bg-retro-pink text-retro-cream border-retro-pink"
                        : category === "Privacy"
                        ? "bg-retro-olive text-retro-cream border-retro-olive"
                        : category === "Features"
                        ? "bg-retro-orange text-retro-cream border-retro-orange"
                        : category === "Payment"
                        ? "bg-retro-burgundy text-retro-cream border-retro-burgundy"
                        : "bg-retro-brown text-retro-cream border-retro-brown"
                      : "bg-retro-cream text-retro-dark border-retro-dark hover:bg-retro-dark hover:text-retro-cream"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
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
                Still Need Help?
              </h3>
              <p className="text-retro-cream/70 text-base mb-6 leading-relaxed">
                Can't find what you're looking for? Our support team is here to help you get your perfect ID photo.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full sm:w-auto border-[2px] border-retro-cream hover:bg-retro-cream hover:text-retro-dark text-retro-cream"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Support
                </Button>
                <Button 
                  variant="hero" 
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
