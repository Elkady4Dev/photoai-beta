import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { User, Camera, Shield, Clock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!formData.agreeToTerms) newErrors.terms = "You must agree to the terms and conditions";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await signUp(formData.email, formData.password, formData.name);

      if (error) {
        if (error.message.includes('already registered')) {
          setErrors({ submit: 'This email is already registered. Please sign in instead.' });
        } else {
          setErrors({ submit: error.message });
        }
      } else {
        setSuccessMessage("Account created! Please check your email to confirm before signing in.");
        setFormData({ name: "", email: "", password: "", confirmPassword: "", agreeToTerms: false });
        setTimeout(() => navigate("/signin"), 3000);
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grain-overlay bg-retro-cream/50">
      <Navigation isLandingPage={false} />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-retro-teal border-[3px] border-retro-dark rounded-lg px-4 py-1.5 shadow-retro-sm mb-6">
              <User className="w-4 h-4 text-retro-cream" />
              <span className="font-display text-sm tracking-wider text-retro-cream">SIGN UP</span>
            </div>
            
            <h1 className="font-display text-[3rem] md:text-[4.5rem] text-retro-dark leading-[0.9] mb-6 tracking-tight">
              CREATE YOUR
              <br />
              <span className="font-display-serif italic text-retro-red text-[2rem] md:text-[3rem]">
                Account
              </span>
            </h1>
            
            <p className="text-retro-dark-mid text-lg max-w-2xl mx-auto font-medium mb-12">
              Join PhotoID Pro and start creating perfect ID photos in seconds
            </p>
          </div>
        </div>
      </section>

      {/* Sign Up Form */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="sticker bg-retro-cream rounded-xl p-8 shadow-retro-lg">

              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-4 bg-retro-teal/10 border-[2px] border-retro-teal rounded-lg">
                  <p className="text-retro-dark text-sm font-medium">{successMessage}</p>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="mb-6 p-4 bg-retro-red/10 border-[2px] border-retro-red rounded-lg">
                  <p className="text-retro-red text-sm font-medium">{errors.submit}</p>
                </div>
              )}

              {/* ── Social Login Buttons ────────────────────── */}
              <SocialAuthButtons mode="signup" />
              {/* ─────────────────────────────────────────────── */}

              <form onSubmit={handleSubmit} className="space-y-6 mt-2">
                {/* Name Field */}
                <div>
                  <label className="block text-retro-dark font-display text-sm mb-2 tracking-wider">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-[2px] border-retro-dark rounded-lg bg-retro-cream/50 focus:outline-none focus:ring-2 focus:ring-retro-teal focus:ring-offset-2 font-medium text-retro-dark placeholder-retro-dark/30"
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                  {errors.name && <p className="text-retro-red text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-retro-dark font-display text-sm mb-2 tracking-wider">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border-[2px] border-retro-dark rounded-lg bg-retro-cream/50 focus:outline-none focus:ring-2 focus:ring-retro-teal focus:ring-offset-2 font-medium text-retro-dark placeholder-retro-dark/30"
                    placeholder="your@email.com"
                    disabled={loading}
                  />
                  {errors.email && <p className="text-retro-red text-sm mt-1">{errors.email}</p>}
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
                      className="w-full px-4 py-3 pr-12 border-[2px] border-retro-dark rounded-lg bg-retro-cream/50 focus:outline-none focus:ring-2 focus:ring-retro-teal focus:ring-offset-2 font-medium text-retro-dark placeholder-retro-dark/30"
                      placeholder="Create a strong password"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-retro-dark hover:text-retro-teal"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-retro-red text-sm mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-retro-dark font-display text-sm mb-2 tracking-wider">
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 border-[2px] border-retro-dark rounded-lg bg-retro-cream/50 focus:outline-none focus:ring-2 focus:ring-retro-teal focus:ring-offset-2 font-medium text-retro-dark placeholder-retro-dark/30"
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  {errors.confirmPassword && <p className="text-retro-red text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Terms Agreement */}
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                      className="w-4 h-4 mt-1 border-[2px] border-retro-dark rounded"
                      disabled={loading}
                    />
                    <span className="text-sm text-retro-dark-mid">
                      I agree to the{" "}
                      <span className="text-retro-teal font-medium">Terms and Conditions</span>
                      {" "}and{" "}
                      <span className="text-retro-teal font-medium">Privacy Policy</span>
                    </span>
                  </label>
                  {errors.terms && <p className="text-retro-red text-sm">{errors.terms}</p>}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={!formData.agreeToTerms || loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-retro-cream border-t-transparent rounded-full animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5 mr-2" />
                      Create Account
                    </>
                  )}
                </Button>

                {/* Sign In Link */}
                <div className="text-center pt-2">
                  <p className="text-retro-dark-mid text-sm">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/signin")}
                      className="text-retro-teal font-medium hover:underline"
                      disabled={loading}
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Camera, title: "AI-Powered Photos", desc: "Smart enhancement technology for perfect results", color: "bg-retro-teal" },
                { icon: Shield, title: "Secure Storage", desc: "Your photos are encrypted and protected", color: "bg-retro-red" },
                { icon: Clock, title: "Instant Delivery", desc: "Get your photos immediately after processing", color: "bg-retro-mustard" }
              ].map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${benefit.color} border-[3px] border-retro-dark rounded-lg flex items-center justify-center mx-auto mb-4 shadow-retro-sm`}>
                    <benefit.icon className="w-8 h-8 text-retro-cream" />
                  </div>
                  <h4 className="font-display text-lg text-retro-dark mb-2">{benefit.title}</h4>
                  <p className="text-sm text-retro-dark-mid">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};