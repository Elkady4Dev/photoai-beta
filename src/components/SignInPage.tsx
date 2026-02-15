import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, UserCircle } from "lucide-react";

export const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Handle successful signin
      console.log("Signin successful:", formData);
      // In a real app, this would make an API call
      alert("Sign in successful! Redirecting to your profile...");
      // Navigate to profile page
      window.location.href = "/profile";
    }
  };

  return (
    <div className="min-h-screen grain-overlay bg-retro-cream/50">
      <Navigation isLandingPage={false} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-retro-red border-[3px] border-retro-dark rounded-lg px-4 py-1.5 shadow-retro-sm mb-6">
              <UserCircle className="w-4 h-4 text-retro-cream" />
              <span className="font-display text-sm tracking-wider text-retro-cream">SIGN IN</span>
            </div>
            
            <h1 className="font-display text-[3rem] md:text-[4.5rem] text-retro-dark leading-[0.9] mb-6 tracking-tight">
              WELCOME
              <br />
              <span className="font-display-serif italic text-retro-red text-[2rem] md:text-[3rem]">
                Back
              </span>
            </h1>
            
            <p className="text-retro-dark-mid text-lg max-w-2xl mx-auto font-medium mb-12">
              Sign in to your PhotoID Pro account to access your orders and profile
            </p>
          </div>
        </div>
      </section>

      {/* Sign In Form */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="sticker bg-retro-cream rounded-xl p-8 shadow-retro-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-retro-dark font-display text-sm mb-2 tracking-wider">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border-[2px] border-retro-dark rounded-lg bg-retro-cream/50 focus:outline-none focus:ring-2 focus:ring-retro-red focus:ring-offset-2 font-medium text-retro-dark placeholder-retro-dark/30"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-retro-red text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-retro-dark font-display text-sm mb-2 tracking-wider">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-3 pr-12 border-[2px] border-retro-dark rounded-lg bg-retro-cream/50 focus:outline-none focus:ring-2 focus:ring-retro-red focus:ring-offset-2 font-medium text-retro-dark placeholder-retro-dark/30"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 text-retro-dark hover:text-retro-red"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-retro-red text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                      className="w-4 h-4 border-[2px] border-retro-dark rounded text-retro-cream focus:ring-2 focus:ring-retro-red focus:ring-offset-2"
                    />
                    <span className="text-sm text-retro-dark-mid">Remember me for 30 days</span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  <UserCircle className="w-5 h-5 mr-2" />
                  Sign In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="space-y-4">
              <p className="text-retro-dark-mid mb-6">
                Don't have an account? 
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-[2px] border-retro-teal hover:bg-retro-teal hover:text-retro-cream"
                  onClick={() => window.location.href = "/signup"}
                >
                  <User className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-[2px] border-retro-dark hover:bg-retro-dark hover:text-retro-cream"
                  onClick={() => alert("Contact support for password recovery")}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Forgot Password?
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
