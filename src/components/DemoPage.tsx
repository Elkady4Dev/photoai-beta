import React from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { ArrowLeft, Play, Camera, FileCheck, Printer, Star, Film } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface Testimonial {
  name: string;
  role: string;
  rating: number;
  comment: string;
}

export const DemoPage = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const demoSteps = [
    {
      icon: Camera,
      title: t('demo.stepsTitle') + " 1: " + t('howItWorks.step1.title'),
      description: t('howItWorks.step1.desc'),
      color: "bg-retro-teal"
    },
    {
      icon: FileCheck,
      title: t('demo.stepsTitle') + " 2: " + t('howItWorks.step2.title'),
      description: t('howItWorks.step2.desc'),
      color: "bg-retro-red"
    },
    {
      icon: Printer,
      title: t('demo.stepsTitle') + " 3: " + t('howItWorks.step3.title'),
      description: t('howItWorks.step3.desc'),
      color: "bg-retro-mustard"
    }
  ];

  return (
    <div className="min-h-screen bg-retro-cream/50 grain-overlay">
      <Navigation isLandingPage={false} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-8 border-[2px] border-retro-dark hover:bg-retro-dark hover:text-retro-cream"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'mr-2' : 'mr-2'}`} />
          {t('demo.backToHome')}
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-retro-red border-[3px] border-retro-dark rounded-lg px-4 py-1.5 shadow-retro-sm mb-6">
            <Film className="w-4 h-4 text-retro-cream" />
            <span className="font-display text-sm tracking-wider text-retro-cream">DEMO</span>
          </div>
          
          <h1 className="font-display text-[3rem] md:text-[4.5rem] text-retro-dark leading-[0.9] mb-6 tracking-tight">
            {t('demo.title')}
            <br />
            <span className="font-display-serif italic text-retro-red text-[2rem] md:text-[3rem]">
              {t('demo.subtitle')}
            </span>
          </h1>
          
          <p className="text-retro-dark-mid text-lg max-w-2xl mx-auto font-medium mb-12">
            {t('demo.description')}
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative bg-retro-dark rounded-xl p-8 shadow-retro-lg">
            {/* Video player placeholder */}
            <div className="aspect-video bg-retro-dark/50 rounded-lg flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-retro-red/80 rounded-full flex items-center justify-center mb-4">
                  <Play className="w-8 h-8 text-retro-cream" />
                </div>
                <p className="text-retro-cream font-display text-lg tracking-wide">
                  {t('demo.clickToPlay')}
                </p>
              </div>
            </div>
            
            {/* Video info overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="text-retro-cream/70 text-sm">
                <span>0:00 / 3:45</span>
              </div>
              <div className="w-32 h-2 bg-retro-cream/30 rounded-full"></div>
              <div className="text-retro-cream/70 text-sm">
                <span>HD</span>
              </div>
            </div>
            
            <p className="text-center text-retro-cream/70 text-sm mt-4">
              {t('demo.demoComingSoon')}
            </p>
          </div>
        </div>

        {/* Demo Steps */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-[2.5rem] md:text-[3.5rem] text-retro-dark leading-[0.9] tracking-tight mb-4">
              {t('demo.stepsTitle')}
              <br />
              <span className="font-display-serif italic text-retro-red text-[1.5rem] md:text-[2.5rem]">
                {t('demo.stepsSubtitle')}
              </span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {demoSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${step.color} border-[3px] border-retro-dark rounded-lg mx-auto mb-4 flex items-center justify-center shadow-retro-sm`}>
                  <step.icon className="w-7 h-7 text-retro-cream" />
                </div>
                <h3 className="font-display text-lg text-retro-dark mb-2">{step.title}</h3>
                <p className="text-sm text-retro-dark-mid font-medium">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-[2.5rem] md:text-[3.5rem] text-retro-dark leading-[0.9] tracking-tight mb-4">
              {t('demo.testimonialsTitle')}
              <br />
              <span className="font-display-serif italic text-retro-red text-[1.5rem] md:text-[2.5rem]">
                {t('demo.testimonialsSubtitle')}
              </span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "سارة أحمد",
                role: "طالبة جامعية",
                rating: 5,
                comment: "أفضل خدمة صور استخدمتها على الإطلاق! سهلة وسريعة."
              },
              {
                name: "محمد علي",
                role: "مطور ويب",
                rating: 5,
                comment: "جودة الصور مذهلة، والواجهة سهلة الاستخدام."
              },
              {
                name: "فاطمة خالد",
                role: "مصممة",
                rating: 5,
                comment: "التصميم الريترو رائع، يجعل الموقع فريدًا."
              }
            ].map((testimonial, index) => (
              <div key={index} className={`sticker bg-retro-cream rounded-xl p-6 ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-retro-mustard fill-retro-mustard" />
                  ))}
                </div>
                <p className="text-retro-dark-mid text-sm font-medium mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div>
                  <div className="font-display text-retro-dark">{testimonial.name}</div>
                  <div className="text-xs text-retro-dark-mid">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
