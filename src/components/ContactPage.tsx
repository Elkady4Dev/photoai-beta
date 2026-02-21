import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, User, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('contact.nameRequired');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('contact.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.emailInvalid');
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.subjectRequired');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contact.messageRequired');
    } else if (formData.message.length < 10) {
      newErrors.message = t('contact.messageMinLength');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Handle successful contact submission
      console.log("Contact form submitted:", formData);
      // In a real app, this would make an API call
      alert(t('contact.successMessage'));
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="min-h-screen grain-overlay bg-retro-cream/50">
      <Navigation isLandingPage={false} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-retro-mustard border-[3px] border-retro-dark rounded-lg px-4 py-1.5 shadow-retro-sm mb-6">
              <Mail className="w-4 h-4 text-retro-dark" />
              <span className="font-display text-sm tracking-wider text-retro-dark">CONTACT</span>
            </div>
            
            <h1 className="font-display text-[3rem] md:text-[4.5rem] text-retro-dark leading-[0.9] mb-6 tracking-tight">
              {t('contact.title')}
              <br />
              <span className="font-display-serif italic text-retro-red text-[2rem] md:text-[3rem]">
                {t('contact.subtitle')}
              </span>
            </h1>
            
            <p className="text-retro-dark-mid text-lg max-w-2xl mx-auto font-medium mb-12">
              {t('contact.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Contact Form */}
              <div>
                <div className="sticker bg-retro-cream rounded-xl p-8 lg:p-10 shadow-retro-lg">
                  <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
                    {/* Name Field */}
                    <div>
                      <label className="block text-retro-dark font-display text-sm mb-2 lg:mb-3 tracking-wider">
                        {t('contact.fullName')}
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 lg:py-4 border-[2px] border-retro-dark rounded-lg bg-retro-cream/50 focus:outline-none focus:ring-2 focus:ring-retro-mustard focus:ring-offset-2 font-medium text-retro-dark placeholder-retro-dark/30"
                        placeholder={t('contact.namePlaceholder')}
                      />
                      {errors.name && (
                        <p className="text-retro-red text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-retro-dark font-display text-sm mb-2 lg:mb-3 tracking-wider">
                        {t('contact.emailAddress')}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 lg:py-4 border-[2px] border-retro-dark rounded-lg bg-retro-cream/50 focus:outline-none focus:ring-2 focus:ring-retro-mustard focus:ring-offset-2 font-medium text-retro-dark placeholder-retro-dark/30"
                        placeholder={t('contact.emailPlaceholder')}
                      />
                      {errors.email && (
                        <p className="text-retro-red text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label className="block text-retro-dark font-display text-sm mb-2 lg:mb-3 tracking-wider">
                        {t('contact.subjectField')}
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-4 py-3 lg:py-4 border-[2px] border-retro-dark rounded-lg bg-retro-cream/50 focus:outline-none focus:ring-2 focus:ring-retro-mustard focus:ring-offset-2 font-medium text-retro-dark placeholder-retro-dark/30"
                        placeholder={t('contact.subjectPlaceholder')}
                      />
                      {errors.subject && (
                        <p className="text-retro-red text-sm mt-1">{errors.subject}</p>
                      )}
                    </div>

                    {/* Message Field */}
                    <div>
                      <label className="block text-retro-dark font-display text-sm mb-2 lg:mb-3 tracking-wider">
                        {t('contact.messageField')}
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={6}
                        className="w-full px-4 py-3 lg:py-4 border-[2px] border-retro-dark rounded-lg bg-retro-cream/50 focus:outline-none focus:ring-2 focus:ring-retro-mustard focus:ring-offset-2 font-medium text-retro-dark placeholder-retro-dark/30 resize-none"
                        placeholder={t('contact.messagePlaceholder')}
                      />
                      {errors.message && (
                        <p className="text-retro-red text-sm mt-1">{errors.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full lg:w-auto"
                    >
                      <Send className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('contact.sendMessage')}
                    </Button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-8 lg:space-y-10">
                {/* Quick Contact */}
                <div className="sticker bg-retro-inverse rounded-xl p-6 lg:p-8 shadow-retro-lg">
                  <h3 className="font-display text-xl lg:text-2xl mb-4 lg:mb-6">{t('contact.quickContact')}</h3>
                  <div className="space-y-4 lg:space-y-6">
                    <div className="flex items-center gap-3 lg:gap-4">
                      <Mail className="w-5 h-5 lg:w-6 lg:h-6" />
                      <div>
                        <div className="font-medium text-base lg:text-lg">{t('contact.email')}</div>
                        <div className="text-retro-dark-mid text-sm lg:text-base">support@sortak</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4">
                      <Phone className="w-5 h-5 lg:w-6 lg:h-6" />
                      <div>
                        <div className="font-medium text-base lg:text-lg">{t('contact.phone')}</div>
                        <div className="text-retro-dark-mid text-sm lg:text-base">1-800-PHOTO-ID</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4">
                      <MapPin className="w-5 h-5 lg:w-6 lg:h-6" />
                      <div>
                        <div className="font-medium text-base lg:text-lg">{t('contact.hours')}</div>
                        <div className="text-retro-dark-mid text-sm lg:text-base">Mon-Fri 9AM-6PM EST</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time */}
                <div className="sticker bg-retro-teal rounded-xl p-6 lg:p-8 shadow-retro-lg">
                  <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                    <MessageSquare className="w-6 h-6 lg:w-7 lg:h-7 text-retro-cream" />
                    <h4 className="font-display text-lg lg:text-xl text-retro-cream">{t('contact.responseTime')}</h4>
                  </div>
                  <div className="space-y-2 lg:space-y-3 text-retro-cream">
                    <div className="flex justify-between">
                      <span className="text-sm lg:text-base">{t('contact.emailSupport')}</span>
                      <span className="font-medium text-sm lg:text-base">{t('contact.within24Hours')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm lg:text-base">{t('contact.phoneSupport')}</span>
                      <span className="font-medium text-sm lg:text-base">{t('contact.businessHours')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm lg:text-base">{t('contact.emergency')}</span>
                      <span className="font-medium text-retro-mustard text-sm lg:text-base">{t('contact.prioritySupport')}</span>
                    </div>
                  </div>
                </div>

                {/* Office Locations */}
                <div className="sticker bg-retro-red rounded-xl p-6 lg:p-8 shadow-retro-lg">
                  <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
                    <MapPin className="w-6 h-6 lg:w-7 lg:h-7 text-retro-cream" />
                    <h4 className="font-display text-lg lg:text-xl text-retro-cream">{t('contact.officeLocations')}</h4>
                  </div>
                  <div className="space-y-2 lg:space-y-3 text-retro-cream">
                    <div>
                      <div className="font-medium text-sm lg:text-base">{t('contact.northAmerica')}</div>
                      <div className="text-retro-cream/70 text-sm lg:text-base">New York, Los Angeles, Toronto</div>
                    </div>
                    <div>
                      <div className="font-medium text-sm lg:text-base">{t('contact.europe')}</div>
                      <div className="text-retro-cream/70 text-sm lg:text-base">London, Paris, Berlin</div>
                    </div>
                    <div>
                      <div className="font-medium text-sm lg:text-base">{t('contact.asiaPacific')}</div>
                      <div className="text-retro-cream/70 text-sm lg:text-base">Tokyo, Sydney, Singapore</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};