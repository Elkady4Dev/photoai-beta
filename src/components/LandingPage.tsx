import React from "react";
import { Camera, FileCheck, Printer, ArrowRight, Shield, Clock, Award, Play, Star, Aperture, Film, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";

interface LandingPageProps {
  onGetStarted: () => void;
  isDemoMode?: boolean;
  toggleDemoMode?: () => void;
}

export const LandingPage = ({ onGetStarted, isDemoMode = false, toggleDemoMode }: LandingPageProps) => {
  return (
    <div className="min-h-screen grain-overlay">
      {/* ===== NAVBAR ===== */}
      <Navigation isLandingPage={true} onGetStarted={onGetStarted} />

      {/* ===== HERO ===== */}
      <section id="home" className="pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left — Big bold retro headline */}
              <div className="animate-slide-up">
                {/* Retro label badge */}
                <div className="inline-flex items-center gap-2 bg-retro-mustard border-[3px] border-retro-dark rounded-lg px-4 py-1.5 shadow-retro-sm mb-6">
                  <Zap className="w-4 h-4 text-retro-dark" />
                  <span className="text-xs font-black uppercase tracking-widest text-retro-dark">AI-Powered</span>
                </div>

                <h1 className="font-display text-[2.5rem] sm:text-[3.5rem] md:text-[5.5rem] lg:text-[7rem] text-retro-dark leading-[0.9] mb-6 tracking-tight">
                  STUDIO&nbsp;QUALITY
                  <br />
                  <span className="text-retro-red font-display-serif italic text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[5.5rem]">
                    Pajama Comfort
                  </span>
                </h1>

                <p className="text-retro-dark-mid text-sm sm:text-base mb-8 max-w-md leading-relaxed font-medium">
                  Create professional photos that meet standard requirements.
                  No studio visit needed — snap, process, done.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button variant="hero" size="lg" onClick={onGetStarted} className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-1 h-5 w-5" />
                  </Button>
                  <button
                    className="text-retro-dark hover:text-retro-teal font-display text-sm tracking-wider uppercase transition-colors duration-150"
                  >
                    <Play className="inline-block w-4 h-4 mr-2" />
                    Watch Demo
                  </button>
                </div>


              </div>

              {/* Right — retro sticker collage */}
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] animate-slide-up-2">
                {/* Film strip decoration */}
                <div className="absolute -top-4 right-4 sm:right-8 lg:right-20 bg-retro-dark text-retro-cream px-2 sm:px-3 py-1 rounded-md border-[3px] border-retro-dark shadow-retro-sm rotate-6 z-40">
                  <span className="font-display text-xs sm:text-sm tracking-wider">4x6</span>
                </div>

                {/* Decorative dots */}
                <div className="absolute top-2 right-4 sm:right-8 w-4 h-4 sm:w-5 sm:h-5 bg-retro-mustard border-[2px] sm:border-[3px] border-retro-dark rounded-full" />
                <div className="absolute bottom-20 sm:bottom-24 lg:bottom-28 left-2 w-3 h-3 sm:w-4 sm:h-4 bg-retro-red border-[2px] border-retro-dark rounded-full" />
                <div className="absolute top-24 sm:top-32 right-2 w-4 h-4 sm:w-6 sm:h-6 bg-retro-teal border-[2px] sm:border-[3px] border-retro-dark rounded-sm rotate-45" />

                {/* Photo frame 1 — 4x6 sticker */}
                <div className="absolute top-0 right-0 w-28 h-[10.5rem] sm:w-36 sm:h-[13.5rem] lg:w-44 lg:h-[16.5rem] sticker bg-retro-cream rounded-xl rotate-6 overflow-hidden z-10">
                  <img
                    src="/images/4x6Section.jpeg"
                    alt="4x6 passport photo example"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* "Your Photo" floating label */}
                <div className="absolute top-4 sm:top-8 lg:top-10 left-2 sm:left-40 bg-retro-red text-retro-cream px-2 sm:px-3 py-1 rounded-md border-[3px] border-retro-dark shadow-retro-sm -rotate-3 z-40">
                  <span className="font-display text-xs sm:text-sm tracking-wider">Your Photo</span>
                </div>

                {/* Photo frame 2 — Your Photo (center, biggest) */}
                <div className="absolute top-8 sm:top-12 lg:top-14 left-2 sm:left-40 w-36 h-44 sm:w-44 sm:h-56 lg:w-56 lg:h-64 sticker bg-retro-cream rounded-xl -rotate-3 overflow-hidden z-20">
                  <img
                    src="/images/yourphotoSection.jpeg"
                    alt="Sample passport photo"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Vinyl record badge */}
                <div className="absolute bottom-8 sm:bottom-10 lg:bottom-12 right-4 sm:right-6 lg:right-8 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-retro-dark border-[2px] sm:border-[3px] border-retro-dark rounded-full z-30 flex items-center justify-center shadow-retro-lg">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-24 lg:h-24 border-[2px] sm:border-[3px] border-retro-mustard rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 border-[2px] border-retro-mustard/50 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6 bg-retro-mustard rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 sm:w-2 sm:h-2 bg-retro-dark rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo frame 3 — Verified sticker */}
                <div className="absolute bottom-0 left-0 w-28 h-36 sm:w-36 sm:h-44 lg:w-48 lg:h-56 sticker bg-retro-cream rounded-xl rotate-3 overflow-hidden z-10">
                  <div className="w-full h-full bg-retro-mustard/10 halftone-bg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-retro-mustard border-[2px] sm:border-[3px] border-retro-dark rounded-lg mx-auto mb-2 sm:mb-3 flex items-center justify-center shadow-retro-sm">
                        <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-retro-dark" />
                      </div>
                      <p className="font-display text-sm sm:text-base lg:text-xl text-retro-dark tracking-wide">VERIFIED</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARQUEE TICKER BANNER ===== */}
      <section className="py-0 animate-slide-up-3">
        <div className="border-y-[3px] border-retro-dark bg-retro-red overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap py-4">
            {Array.from({ length: 4 }).map((_, setIdx) => (
              <div key={setIdx} className="flex items-center shrink-0">
                {[
                  "500+ PHOTOS CREATED",
                  "4.9 USER RATING",
                  "100% ACCEPTANCE RATE",
                  "AI-POWERED",
                  "NO STUDIO NEEDED",
                  "INSTANT DELIVERY",
                ].map((text, i) => (
                  <React.Fragment key={i}>
                    <div className="flex items-center gap-2 shrink-0 px-4">
                      <Star className="w-4 h-4 text-retro-cream fill-retro-cream flex-shrink-0" />
                      <span className="font-display text-lg text-retro-cream tracking-wider whitespace-nowrap">{text}</span>
                    </div>
                    <div className="w-1 h-4 bg-retro-cream/30 rounded-full shrink-0" />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS — retro sticker cards ===== */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="mb-14 animate-slide-up-3">
              <div className="inline-flex items-center gap-2 bg-retro-dark text-retro-cream px-4 py-1.5 rounded-lg border-[3px] border-retro-dark shadow-retro-sm mb-5">
                <Film className="w-4 h-4" />
                <span className="font-display text-sm tracking-wider">HOW IT WORKS</span>
              </div>
              <h2 className="font-display text-[2rem] sm:text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] text-retro-dark leading-[0.9] tracking-tight">
                THREE SIMPLE
                <br />
                <span className="font-display-serif italic text-retro-red text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3.5rem]">
                  Steps to perfection
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-slide-up-4">
              {[
                {
                  icon: Camera,
                  step: "01",
                  title: "TAKE YOUR PHOTO",
                  desc: "Use your device camera with smart face detection and real-time guidance",
                  bg: "bg-retro-teal",
                  accent: "bg-retro-teal/10",
                  rotate: "-rotate-1",
                },
                {
                  icon: FileCheck,
                  step: "02", 
                  title: "CHOOSE SIZE",
                  desc: "Select the size you need with standard requirements and specifications",
                  bg: "bg-retro-red",
                  accent: "bg-retro-red/10",
                  rotate: "rotate-2",
                },
                {
                  icon: Printer,
                  step: "03",
                  title: "GET YOUR PHOTOS",
                  desc: "Download instantly or get prints delivered to your door in any format you need",
                  bg: "bg-retro-mustard",
                  accent: "bg-retro-mustard/10",
                  rotate: "-rotate-2",
                },
              ].map((step, index) => (
                <div
                  key={step.title}
                  className={`sticker bg-retro-cream rounded-xl p-5 sm:p-6 ${step.rotate} hover:rotate-0 transition-all duration-300 relative ${
                    index === 1 ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  {/* Icon instead of step number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 sm:w-14 sm:h-14 bg-retro-dark border-[3px] border-retro-dark rounded-full flex items-center justify-center z-10 shadow-retro-sm">
                    <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-retro-cream" />
                  </div>

                  {/* Step image area */}
                  <div className={`w-full aspect-[4/3] ${step.accent} border-[2px] border-retro-dark/20 rounded-lg flex items-center justify-center mb-4 sm:mb-5 overflow-hidden`}>
                    <img 
                      src={`${import.meta.env.BASE_URL}images/img${step.step.slice(-1)}.PNG`} 
                      alt={step.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Card info */}
                  <h3 className="font-display text-lg sm:text-xl text-retro-dark mb-2 sm:mb-3 tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-retro-dark-mid text-xs sm:text-sm mb-3 sm:mb-4 font-medium leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES — retro card grid ===== */}
      <section id="features" className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-retro-red border-[3px] border-retro-dark rounded-lg px-4 py-1.5 shadow-retro-sm mb-5">
                <Film className="w-4 h-4 text-retro-cream" />
                <span className="font-display text-sm tracking-wider text-retro-cream">FEATURES</span>
              </div>
              <h2 className="font-display text-[3rem] md:text-[4.5rem] text-retro-dark leading-[0.9] tracking-tight mb-4">
                AMAZING
                <br />
                <span className="font-display-serif italic text-retro-red text-[2.5rem] md:text-[3.5rem]">
                  Features
                </span>
              </h2>
              <p className="text-retro-dark-mid text-lg max-w-2xl mx-auto font-medium">
                Cutting-edge technology meets retro design. Everything you need for perfect photos.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: "STANDARD COMPLIANCE",
                  desc: "Photos meet all professional size requirements",
                  color: "bg-retro-red",
                },
                {
                  icon: Clock,
                  title: "READY IN MINUTES",
                  desc: "No waiting, no appointments needed. Get your photos instantly",
                  color: "bg-retro-teal",
                },
                {
                  icon: Award,
                  title: "GUARANTEED ACCEPTANCE",
                  desc: "AI-verified to pass inspection with 99.8% success rate",
                  color: "bg-retro-mustard",
                },
                {
                  icon: Camera,
                  title: "AI PHOTO ENHANCEMENT",
                  desc: "Automatic lighting, color correction, and background removal",
                  color: "bg-retro-red",
                },
                {
                  icon: Zap,
                  title: "INSTANT DELIVERY",
                  desc: "Download immediately or get prints delivered to your door",
                  color: "bg-retro-teal",
                },
                {
                  icon: Shield,
                  title: "SECURE & PRIVATE",
                  desc: "Your photos are encrypted and deleted after processing",
                  color: "bg-retro-mustard",
                },
              ].map((f, i) => (
                <div key={f.title} className={`sticker bg-retro-cream rounded-xl p-6 ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-all duration-300`}>
                  <div className="text-center group">
                    <div className={`w-16 h-16 ${f.color} border-[3px] border-retro-dark rounded-lg flex items-center justify-center mx-auto mb-4 shadow-retro-sm group-hover:shadow-retro-hover group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-150`}>
                      <f.icon className="w-7 h-7 text-retro-cream" strokeWidth={2} />
                    </div>
                    <h4 className="font-display text-xl text-retro-dark mb-2 tracking-wide">{f.title}</h4>
                    <p className="text-sm text-retro-dark-mid font-medium leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA — retro poster style ===== */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-retro-dark border-[3px] border-retro-dark rounded-xl p-10 md:p-16 text-center relative overflow-hidden shadow-retro-lg">
              {/* Decorative retro shapes */}
              <div className="absolute top-5 left-6 w-10 h-10 border-[3px] border-retro-teal/40 rounded-lg rotate-12" />
              <div className="absolute bottom-6 right-10 w-8 h-8 bg-retro-mustard/30 border-[2px] border-retro-mustard/40 rounded-full" />
              <div className="absolute top-8 right-16 w-6 h-6 bg-retro-red/30 border-[2px] border-retro-red/30 rounded-sm rotate-45" />
              <div className="absolute bottom-12 left-16 w-4 h-4 bg-retro-teal/20 rounded-full" />

              {/* Halftone background */}
              <div className="absolute inset-0 halftone-bg opacity-30" />

              <div className="relative z-10">
                <h2 className="font-display text-[1.8rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[4rem] text-retro-cream mb-2 tracking-tight leading-[0.95] text-center sm:text-left">
                  READY TO GET YOUR
                </h2>
                <p className="font-display-serif italic text-retro-mustard text-[1.5rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] mb-4 sm:mb-6 text-center sm:text-left">
                  Perfect Photo?
                </p>
                <p className="text-retro-cream/50 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto sm:mx-0 font-medium text-center sm:text-left">
                  Create professional photos in minutes. No appointment needed.
                </p>
                <div className="flex justify-center sm:justify-start">
                  <Button variant="hero" size="lg" onClick={onGetStarted} className="w-full sm:w-auto text-center">
                    <span className="text-center">Take Your Photo Now</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT US SECTION ===== */}
      <section id="about" className="py-20 lg:py-28 bg-retro-cream/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-retro-teal border-[3px] border-retro-dark rounded-lg px-4 py-1.5 shadow-retro-sm mb-5">
                <Aperture className="w-4 h-4 text-retro-cream" />
                <span className="font-display text-sm tracking-wider text-retro-cream">ABOUT US</span>
              </div>
              <h2 className="font-display text-[3rem] md:text-[4.5rem] text-retro-dark leading-[0.9] tracking-tight mb-4">
                MEET THE
                <br />
                <span className="font-display-serif italic text-retro-red text-[2.5rem] md:text-[3.5rem]">
                  Photo Team
                </span>
              </h2>
              <p className="text-retro-dark-mid text-lg max-w-2xl mx-auto font-medium">
                We're passionate about making professional photos accessible to everyone.
                No studios, no appointments, just perfect photos every time.
              </p>
            </div>

            {/* Story content */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                <div className="sticker bg-retro-cream rounded-xl p-6 -rotate-1">
                  <h3 className="font-display text-2xl text-retro-dark mb-3 tracking-wide">Our Story</h3>
                  <p className="text-retro-dark-mid leading-relaxed mb-4">
                    Founded in 2025, Sortak emerged from a simple frustration: why should getting
                    a professional photo be complicated? We combined cutting-edge AI technology
                    with retro-inspired design to create something truly unique.
                  </p>
                  <p className="text-retro-dark-mid leading-relaxed">
                    Today, we've helped thousands of people get perfect professional photos with various photo sizes - all from the comfort of their homes.
                  </p>
                </div>

                <div className="sticker bg-retro-mustard/10 border-[3px] border-retro-dark rounded-xl p-6 rotate-1">
                  <h3 className="font-display text-2xl text-retro-dark mb-3 tracking-wide">Why Choose Us?</h3>
                  <ul className="space-y-3">
                    {[
                      "AI-powered perfection guarantee",
                      "100% professional compliance rate", 
                      "Retro style meets modern tech",
                      "24/7 customer support",
                      "Eco-friendly digital-first approach"
                    ].map((point, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-retro-mustard border-[2px] border-retro-dark rounded-sm flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-retro-dark rounded-full" />
                        </div>
                        <span className="text-retro-dark font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Visual side */}
              <div className="relative">
                <div className="sticker bg-retro-dark rounded-xl p-8 rotate-2 shadow-retro-lg">
                  <div className="aspect-[4/3] bg-retro-teal/10 border-[2px] border-retro-dark/20 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-retro-teal border-[3px] border-retro-dark rounded-lg mx-auto mb-4 flex items-center justify-center shadow-retro-sm">
                        <Camera className="w-12 h-12 text-retro-cream" />
                      </div>
                      <div className="space-y-2">
                        <div className="font-display text-3xl text-retro-cream">50K+</div>
                        <div className="text-sm text-retro-cream/70 font-medium">Happy Customers</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-retro-cream/10 border-[2px] border-retro-dark/20 rounded-lg">
                      <div className="font-display text-2xl text-retro-cream">99.8%</div>
                      <div className="text-xs text-retro-cream/70">Acceptance Rate</div>
                    </div>
                    <div className="text-center p-4 bg-retro-cream/10 border-[2px] border-retro-dark/20 rounded-lg">
                      <div className="font-display text-2xl text-retro-cream">150+</div>
                      <div className="text-xs text-retro-cream/70">Countries</div>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-retro-red border-[3px] border-retro-dark rounded-lg rotate-12" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-retro-mustard border-[2px] border-retro-dark rounded-full" />
              </div>
            </div>

            {/* Team preview */}
            <div className="text-center">
              <div className="sticker bg-retro-cream rounded-xl p-8">
                <h3 className="font-display text-2xl text-retro-dark mb-6 tracking-wide">Behind the Lens</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-6 mb-6">
                  {[
                    { name: "Seif Mohamed", initials: "SM", color: "bg-retro-teal" },
                    { name: "Ahmed ELKeshawy", initials: "AK", color: "bg-retro-red" },
                    { name: "Yousef ELKady", initials: "YK", color: "bg-retro-mustard" },
                    { name: "Youssef Mokhles", initials: "YM", color: "bg-retro-teal" },
                    { name: "Amr ELDeeb", initials: "AD", color: "bg-retro-red" },
                    { name: "Youssef Sadeq", initials: "YS", color: "bg-retro-mustard" }
                  ].map((member, i) => (
                    <div key={i} className="text-center">
                      <div className={`w-16 h-16 ${member.color} border-[3px] border-retro-dark rounded-lg mx-auto mb-3 flex items-center justify-center shadow-retro-sm`}>
                        <span className="font-display text-xl text-retro-cream">
                          {member.initials}
                        </span>
                      </div>
                      <div className="font-display text-sm text-retro-dark font-medium">{member.name}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-retro-dark-mid font-medium">
                  A diverse team of developers, designers, engineers and Aura farmers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-retro-mustard border-[3px] border-retro-dark rounded-lg px-4 py-1.5 shadow-retro-sm mb-5">
                <Zap className="w-4 h-4 text-retro-dark" />
                <span className="font-display text-sm tracking-wider text-retro-dark">PRICING</span>
              </div>
              <h2 className="font-display text-[3rem] md:text-[4.5rem] text-retro-dark leading-[0.9] tracking-tight mb-4">
                CHOOSE YOUR
                <br />
                <span className="font-display-serif italic text-retro-red text-[2.5rem] md:text-[3.5rem]">
                  Perfect Plan
                </span>
              </h2>
              <p className="text-retro-dark-mid text-lg max-w-2xl mx-auto font-medium">
                Professional ID photos at prices that make sense. No hidden fees, just perfect photos every time.
              </p>
            </div>

            {/* Pricing cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="sticker bg-retro-cream rounded-xl p-8 rotate-1 hover:rotate-0 transition-all duration-300 relative">
                <div className="absolute -top-3 -right-3 bg-retro-teal border-[3px] border-retro-dark rounded-lg px-3 py-1 shadow-retro-sm">
                  <span className="text-xs font-black uppercase text-retro-cream">Popular</span>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="font-display text-2xl text-retro-dark mb-2">BASIC</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="font-display text-4xl text-retro-dark">$9</span>
                    <span className="text-retro-dark-mid font-medium">/photo</span>
                  </div>
                  <p className="text-sm text-retro-dark-mid">Perfect for single documents</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "1 Professional ID Photo",
                    "Digital Download (JPEG/PNG)",
                    "Basic Background Removal",
                    "Email Delivery",
                    "24 Hour Processing"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-retro-dark">
                      <div className="w-4 h-4 bg-retro-teal border-[2px] border-retro-dark rounded-sm flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-retro-cream rounded-full" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  variant="outline" 
                  className="w-full border-[2px] border-retro-dark hover:bg-retro-dark hover:text-retro-cream"
                  onClick={onGetStarted}
                >
                  Get Started
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="sticker bg-retro-dark rounded-xl p-8 -rotate-1 hover:rotate-0 transition-all duration-300 relative shadow-retro-lg">
                <div className="absolute -top-3 -right-3 bg-retro-red border-[3px] border-retro-dark rounded-lg px-3 py-1 shadow-retro-sm">
                  <span className="text-xs font-black uppercase text-retro-cream">Best Value</span>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="font-display text-2xl text-retro-cream mb-2">PRO</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="font-display text-4xl text-retro-cream">$19</span>
                    <span className="text-retro-cream/70 font-medium">/photo</span>
                  </div>
                  <p className="text-sm text-retro-cream/70">Everything you need for professional results</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "3 Professional ID Photos",
                    "Digital + Print Ready Files",
                    "Advanced Background Removal",
                    "Instant Email + SMS Delivery",
                    "Priority Processing (1 Hour)",
                    "Color & Lighting Enhancement",
                    "Multiple Formats (JPEG, PNG, PDF)"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-retro-cream">
                      <div className="w-4 h-4 bg-retro-mustard border-[2px] border-retro-cream rounded-sm flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-retro-dark rounded-full" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  variant="hero" 
                  className="w-full"
                  onClick={onGetStarted}
                >
                  Go Pro
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className="sticker bg-retro-cream rounded-xl p-8 rotate-1 hover:rotate-0 transition-all duration-300 relative">
                <div className="absolute -top-3 -right-3 bg-retro-mustard border-[3px] border-retro-dark rounded-lg px-3 py-1 shadow-retro-sm">
                  <span className="text-xs font-black uppercase text-retro-dark">Business</span>
                </div>
                
                <div className="text-center mb-6">
                  <h3 className="font-display text-2xl text-retro-dark mb-2">ENTERPRISE</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="font-display text-4xl text-retro-dark">$49</span>
                    <span className="text-retro-dark-mid font-medium">/month</span>
                  </div>
                  <p className="text-sm text-retro-dark-mid">Unlimited photos for teams and businesses</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited ID Photos",
                    "Team Management Dashboard",
                    "API Access & Integration",
                    "White Label Options",
                    "Custom Branding",
                    "Priority Support",
                    "Bulk Processing",
                    "Advanced Analytics"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium text-retro-dark">
                      <div className="w-4 h-4 bg-retro-red border-[2px] border-retro-dark rounded-sm flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-retro-cream rounded-full" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  variant="outline" 
                  className="w-full border-[2px] border-retro-dark hover:bg-retro-dark hover:text-retro-cream"
                  onClick={onGetStarted}
                >
                  Contact Sales
                </Button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 bg-retro-cream border-[3px] border-retro-dark rounded-lg px-6 py-3 shadow-retro-sm">
                <Shield className="w-5 h-5 text-retro-dark" />
                <span className="font-display text-sm text-retro-dark tracking-wider">
                  30-DAY MONEY BACK GUARANTEE
                </span>
              </div>
              <p className="mt-4 text-sm text-retro-dark-mid font-medium">
                Not satisfied? Get a full refund, no questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER — retro style ===== */}
      <footer className="py-6 border-t-[3px] border-retro-dark">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-retro-red border-[2px] border-retro-dark rounded-md flex items-center justify-center">
              <Aperture className="w-4 h-4 text-retro-cream" />
            </div>
            <span className="font-display text-2xl text-retro-dark tracking-wide">SORTAK</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-retro-dark-mid">
            &copy; {new Date().getFullYear()} Sortak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
