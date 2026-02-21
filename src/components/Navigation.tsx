import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, X, User, ChevronDown, LogIn, UserCircle, Package, Aperture, LogOut, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavigationProps {
  currentStep?: number;
  onBack?: () => void;
  showBackButton?: boolean;
  onGetStarted?: () => void;
  isLandingPage?: boolean;
}

export const Navigation = ({ 
  currentStep, 
  onBack, 
  showBackButton, 
  onGetStarted, 
  isLandingPage = true 
}: NavigationProps) => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();

  const navItems = [
    { name: t('nav.home'), href: "#home", id: "home" },
    { name: t('nav.howItWorks'), href: "#how-it-works", id: "how-it-works" },
    { name: t('nav.features'), href: "#features", id: "features" },
    { name: t('nav.about'), href: "#about", id: "about" },
    { name: t('nav.pricing'), href: "#pricing", id: "pricing" },
    { name: t('nav.demo'), href: "/demo", id: "demo" },
    { name: t('nav.faq'), href: "/faq", id: "faq" },
    { name: t('nav.contact'), href: "/contact", id: "contact" },
  ];

  useEffect(() => {
    if (!isLandingPage) {
      // For non-landing pages, set active section based on current path
      const currentPath = location.pathname;
      
      // Don't highlight any nav items for demo page
      if (currentPath === '/demo') {
        setActiveSection("");
        return;
      }
      
      const activeItem = navItems.find(item => item.href === currentPath);
      
      if (activeItem) {
        setActiveSection(activeItem.id);
      } else {
        // For photo flow pages, don't highlight any nav item
        setActiveSection("");
      }
      return;
    }

    const handleScroll = () => {
      const sections = navItems.map(item => ({
        id: item.id,
        element: item.href.startsWith('/') ? null : document.querySelector(item.href)
      }));

      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        if (section.element) {
          const { offsetTop, offsetHeight } = section.element as HTMLElement;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLandingPage, location.pathname]);

  const handleNavClick = (href: string) => {
    if (isLandingPage) {
      if (href.startsWith('/')) {
        // Navigate to different page
        navigate(href);
      } else {
        // Scroll to section
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      // If not on landing page, handle navigation
      if (href === "#home" || href === "/") {
        // Always go to landing page for home
        navigate("/");
      } else if (href.startsWith('/')) {
        // Navigate to other pages
        navigate(href);
      } else {
        // For section links, go to landing page and scroll
        navigate("/");
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    if (isLandingPage) {
      handleNavClick("#home");
    } else {
      // If we're on any other page, go to home
      navigate("/");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="py-5 border-b-[3px] border-retro-dark bg-retro-cream/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo as retro badge */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 bg-retro-red border-[3px] border-retro-dark rounded-lg shadow-retro-sm flex items-center justify-center group-hover:shadow-retro-hover group-hover:translate-x-[1px] group-hover:translate-y-[1px] transition-all duration-150">
              <Aperture className="w-5 h-5 text-retro-cream" />
            </div>
            <span className="font-display text-3xl text-retro-dark tracking-wide">SORTAK</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`text-sm font-bold uppercase tracking-wider px-4 py-2 cursor-pointer transition-all duration-150 rounded-md ${
                  activeSection === item.id
                    ? "bg-retro-dark text-retro-cream shadow-retro-sm"
                    : "text-retro-dark hover:bg-retro-dark hover:text-retro-cream hover:shadow-retro-sm"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Get Started - Always visible */}
            {!isLandingPage && (
              <Button 
                variant="hero" 
                size="default" 
                onClick={() => navigate('/')}
                className="hidden md:flex bg-retro-red hover:bg-retro-red/90 border-retro-red shadow-retro-lg hover:shadow-retro-xl transform hover:scale-105 transition-all duration-200"
              >
                {t('nav.getStarted')}
              </Button>
            )}
            
            {/* Get Started - Prominent on Landing */}
            {isLandingPage && onGetStarted && (
              <Button 
                variant="hero" 
                size="default" 
                onClick={onGetStarted}
                className="hidden md:flex bg-retro-red hover:bg-retro-red/90 border-retro-red shadow-retro-lg hover:shadow-retro-xl transform hover:scale-105 transition-all duration-200"
              >
                {t('nav.getStarted')}
              </Button>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 bg-retro-dark border-[3px] border-retro-dark rounded-lg flex items-center justify-center shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-retro-cream" /> : <Menu className="w-5 h-5 text-retro-cream" />}
            </button>
            
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="w-10 h-10 bg-retro-mustard border-[3px] border-retro-dark rounded-lg flex items-center justify-center shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
              title={t('language')}
            >
              <Globe className="w-5 h-5 text-retro-dark" />
            </button>
            
            {/* Profile Dropdown - Always visible */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 bg-retro-dark border-[3px] border-retro-dark rounded-lg flex items-center justify-center shadow-retro-sm hover:shadow-retro-hover hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150"
              >
                <User className="w-5 h-5 text-retro-cream" />
              </button>
              
              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-12 w-48 bg-retro-cream border-[3px] border-retro-dark rounded-lg shadow-retro-lg z-50`}>
                  <div className="py-2">
                    {user ? (
                      // Logged-in: show profile + sign out
                      <>
                        <button
                          onClick={() => {
                            navigate('/profile');
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-retro-dark hover:bg-retro-dark hover:text-retro-cream transition-colors duration-150 flex items-center gap-3"
                        >
                          <Package className="w-4 h-4" />
                          <span className="font-medium">{t('nav.myProfile')}</span>
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-3 text-retro-dark hover:bg-retro-red hover:text-retro-cream transition-colors duration-150 flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">{t('nav.signOut')}</span>
                        </button>
                      </>
                    ) : (
                      // Logged-out: show sign up + sign in
                      <>
                        <button
                          onClick={() => {
                            navigate('/signup');
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-retro-dark hover:bg-retro-dark hover:text-retro-cream transition-colors duration-150 flex items-center gap-3"
                        >
                          <LogIn className="w-4 h-4" />
                          <span className="font-medium">{t('nav.signUp')}</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate('/signin');
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-retro-dark hover:bg-retro-dark hover:text-retro-cream transition-colors duration-150 flex items-center gap-3"
                        >
                          <UserCircle className="w-4 h-4" />
                          <span className="font-medium">{t('nav.signIn')}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t-[3px] border-retro-dark">
            <div className="flex flex-col gap-2">
              {showBackButton && onBack && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="w-full justify-start items-center gap-2 border-[2px] border-retro-dark hover:bg-retro-dark hover:text-retro-cream"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              
              {/* Navigation Items */}
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-sm font-bold uppercase tracking-wider px-4 py-3 cursor-pointer transition-all duration-150 rounded-md text-left ${
                    activeSection === item.id
                      ? "bg-retro-dark text-retro-cream shadow-retro-sm"
                      : "text-retro-dark hover:bg-retro-dark hover:text-retro-cream hover:shadow-retro-sm"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {/* Profile Section for Mobile */}
              <div className="pt-2 border-t-[2px] border-retro-dark/20">
                {user ? (
                  // Logged-in: show profile + sign out
                  <>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-retro-dark hover:bg-retro-dark hover:text-retro-cream transition-colors duration-150 flex items-center gap-3"
                    >
                      <Package className="w-4 h-4" />
                      <span className="font-medium">{t('nav.myProfile')}</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-retro-dark hover:bg-retro-red hover:text-retro-cream transition-colors duration-150 flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">{t('nav.signOut')}</span>
                    </button>
                  </>
                ) : (
                  // Logged-out: show sign up + sign in
                  <>
                    <button
                      onClick={() => {
                        navigate('/signup');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-retro-dark hover:bg-retro-dark hover:text-retro-cream transition-colors duration-150 flex items-center gap-3"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="font-medium">{t('nav.signUp')}</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('/signin');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-retro-dark hover:bg-retro-dark hover:text-retro-cream transition-colors duration-150 flex items-center gap-3"
                    >
                      <UserCircle className="w-4 h-4" />
                      <span className="font-medium">{t('nav.signIn')}</span>
                    </button>
                  </>
                )}
              </div>
              
              {/* Get Started for Mobile */}
              {isLandingPage && onGetStarted && (
                <Button variant="hero" size="default" onClick={onGetStarted} className="w-full mt-2">
                  {t('nav.getStarted')}
                </Button>
              )}
              
              {/* Get Started for Non-Landing Pages Mobile */}
              {!isLandingPage && (
                <Button 
                  variant="hero" 
                  size="default" 
                  onClick={() => navigate('/')} 
                  className="w-full mt-2 bg-retro-red hover:bg-retro-red/90 border-retro-red shadow-retro-lg hover:shadow-retro-xl transform hover:scale-105 transition-all duration-200"
                >
                  {t('nav.getStarted')}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};