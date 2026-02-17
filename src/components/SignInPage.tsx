import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, UserCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";

export const SignInPage = () => {
  const navigate = useNavigate();
  const { signIn, resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ submit: 'Invalid email or password. Please try again.' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ submit: 'Please confirm your email address before signing in.' });
        } else {
          setErrors({ submit: error.message });
        }
      } else {
        navigate("/profile");
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMessage("");
    
    if (!resetEmail.trim()) {
      setResetMessage("Please enter your email address");
      return;
    }

    setResetLoading(true);

    try {
      const { error } = await resetPassword(resetEmail);

      if (error) {
        setResetMessage(error.message);
      } else {
        setResetMessage("Password reset email sent! Please check your inbox.");
        setTimeout(() => {
          setShowResetPassword(false);
          setResetEmail("");
          setResetMessage("");
        }, 3000);
      }
    } catch (error) {
      setResetMessage("An unexpected error occurred. Please try again.");
    } finally {
      setResetLoading(false);
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
              Sign in to your PhotoID Pro account to access your profile
            </p>
          </div>
        </div>
      </section>

      {/* Sign In Form */}
      <section className="py-12 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="sticker bg-retro-cream rounded-xl p-8 shadow-retro-lg">
              {!showResetPassword ? (
                <>
                  {/* Error Message */}
                  {errors.submit && (
                    <div className="mb-6 p-4 bg-retro-red/10 border-[2px] border-retro-red rounded-lg">
                      <p className="text-retro-red text-sm font-medium">{errors.submit}</p>
                    </div>
                  )}

                  {/* ── Social Login Buttons ─────────────────── */}
                  <SocialAuthButtons mode="signin" />
                  {/* ─────────────────────────────────────────── */}

                  <form onSubmit={handleSubmit} className="space-y-6 mt-2">
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
                        disabled={loading}
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
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-retro-dark hover:text-retro-red"
                          disabled={loading}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-retro-red text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.rememberMe}
                          onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                          className="w-4 h-4 border-[2px] border-retro-dark rounded"
                          disabled={loading}
                        />
                        <span className="text-sm text-retro-dark-mid">Remember me</span>
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(true)}
                        className="text-sm text-retro-red font-medium hover:underline"
                        disabled={loading}
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-retro-cream border-t-transparent rounded-full animate-spin mr-2" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          <UserCircle className="w-5 h-5 mr-2" />
                          Sign In
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>

                    {/* Sign Up Link */}
                    <div className="text-center pt-2">
                      <p className="text-retro-dark-mid text-sm">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => navigate("/signup")}
                          className="text-retro-teal font-medium hover:underline"
                          disabled={loading}
                        >
                          Create Account
                        </button>
                      </p>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  {/* Reset Password Form */}
                  <button
                    onClick={() => { setShowResetPassword(false); setResetEmail(""); setResetMessage(""); }}
                    className="text-retro-red hover:underline text-sm flex items-center gap-2 mb-6"
                  >
                    ← Back to sign in
                  </button>

                  <h3 className="font-display text-2xl text-retro-dark mb-2">Reset Password</h3>
                  <p className="text-retro-dark-mid text-sm mb-6">
                    Enter your email and we'll send you a reset link.
                  </p>

                  {resetMessage && (
                    <div className={`mb-6 p-4 border-[2px] rounded-lg ${
                      resetMessage.includes("sent")
                        ? "bg-retro-teal/10 border-retro-teal"
                        : "bg-retro-red/10 border-retro-red"
                    }`}>
                      <p className={`text-sm font-medium ${resetMessage.includes("sent") ? "text-retro-dark" : "text-retro-red"}`}>
                        {resetMessage}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                      <label className="block text-retro-dark font-display text-sm mb-2 tracking-wider">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full px-4 py-3 border-[2px] border-retro-dark rounded-lg bg-retro-cream/50 focus:outline-none focus:ring-2 focus:ring-retro-red focus:ring-offset-2 font-medium text-retro-dark placeholder-retro-dark/30"
                        placeholder="your@email.com"
                        disabled={resetLoading}
                      />
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={resetLoading}>
                      {resetLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-retro-cream border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5 mr-2" />
                          Send Reset Link
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};