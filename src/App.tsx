import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { FAQPage } from "@/components/FAQPage";
import { ContactPage } from "@/components/ContactPage";
import { ProfilePage } from "@/components/ProfilePage";
import { SignUpPage } from "@/components/SignUpPage";
import { SignInPage } from "@/components/SignInPage";
import { PhotoCapturePage } from "@/pages/PhotoCapturePage";
import { DocumentTypePage } from "@/pages/DocumentTypePage";
import { PhotoVariationsPage } from "@/pages/PhotoVariationsPage";
import { DeliveryConfirmationPage } from "@/pages/DeliveryConfirmationPage";
import { SuccessPageRoute } from "@/pages/SuccessPageRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { handleNetworkError } from "@/utils/errorReporting";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DemoPage } from "./components/DemoPage";
import { TokenPreserver } from "./components/TokenPreserver";
import { PhotoFlowProvider } from "@/contexts/PhotoFlowContext";

const queryClient = new QueryClient();

// Global error handlers...
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    handleNetworkError(new Error(`Unhandled promise rejection: ${event.reason}`));
  });

  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    handleNetworkError(event.error || new Error('Unknown global error'));
  });
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* --- WRAP EVERYTHING IN LANGUAGEPROVIDER --- */}
      <ThemeProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <ErrorBoundary>
          <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <AuthProvider>
              <PhotoFlowProvider>
              <TokenPreserver />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/unauthorized" element={<NotFound />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/demo" element={<DemoPage />} />

                {/* Protected routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Photo flow routes */}
                <Route 
                  path="/photo-capture" 
                  element={
                    <ProtectedRoute>
                      <PhotoCapturePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/document-type" 
                  element={
                    <ProtectedRoute>
                      <DocumentTypePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/photo-variations" 
                  element={
                    <ProtectedRoute>
                      <PhotoVariationsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/delivery-confirmation" 
                  element={
                    <ProtectedRoute>
                      <DeliveryConfirmationPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/success" 
                  element={
                    <ProtectedRoute>
                      <SuccessPageRoute />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              </PhotoFlowProvider>
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;