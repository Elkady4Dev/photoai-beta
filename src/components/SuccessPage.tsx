import { CheckCircle, Download, Package, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessPageProps {
  wantsPrint: boolean;
  onStartOver: () => void;
  onBack?: () => void;
  selectedVariationData?: any;
}

export const SuccessPage = ({ wantsPrint, onStartOver, onBack, selectedVariationData }: SuccessPageProps) => {
  const handleDownload = () => {
    console.log('Download clicked, selectedVariationData:', selectedVariationData);
    
    if (!selectedVariationData) {
      console.error('No selectedVariationData available');
      alert('No photo data available for download');
      return;
    }

    if (!selectedVariationData.imageDataUrl) {
      console.error('No imageDataUrl in selectedVariationData');
      alert('No image data available for download');
      return;
    }

    try {
      let imageDataUrl = selectedVariationData.imageDataUrl;
      console.log('Original imageDataUrl length:', imageDataUrl.length);
      console.log('ImageDataUrl starts with:', imageDataUrl.substring(0, 50));

      // Handle demo mode URLs (external URLs)
      if (imageDataUrl.startsWith('http')) {
        // For demo mode with external URLs, fetch and convert to blob
        fetch(imageDataUrl)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = selectedVariationData.filename || 'professional-photo.jpg';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }, 100);
            console.log('External image download successful');
          })
          .catch(error => {
            console.error('Failed to fetch external image:', error);
            alert('Download failed. Please try again.');
          });
        return;
      }

      // Handle data URLs
      if (imageDataUrl.startsWith('data:')) {
        // Extract the base64 part more carefully
        let base64Data, mimeType;
        
        const lastCommaIndex = imageDataUrl.lastIndexOf(',');
        if (lastCommaIndex === -1) {
          throw new Error('Invalid data URL format - no comma found');
        }
        
        const headerPart = imageDataUrl.substring(0, lastCommaIndex);
        const dataPart = imageDataUrl.substring(lastCommaIndex + 1);
        
        // Extract MIME type
        const mimeMatch = headerPart.match(/data:([^;]+)/);
        if (!mimeMatch) {
          throw new Error('Could not extract MIME type from data URL');
        }
        mimeType = mimeMatch[1];
        base64Data = dataPart;
        
        console.log('Extracted MIME type:', mimeType);
        console.log('Base64 data length:', base64Data.length);

        // Clean base64 data (remove any whitespace or invalid characters)
        const cleanBase64 = base64Data.replace(/\s/g, '');
        
        // Convert base64 to binary
        let byteCharacters;
        try {
          byteCharacters = atob(cleanBase64);
        } catch (error) {
          console.error('Base64 decode failed:', error);
          console.error('Base64 data sample:', cleanBase64.substring(0, 100));
          throw new Error('Invalid base64 data format');
        }
        
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        
        console.log('Blob created successfully, size:', blob.size, 'type:', mimeType);

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = selectedVariationData.filename || 'professional-photo.jpg';
        link.style.display = 'none';
        
        console.log('Download link created, filename:', link.download);
        
        // Force download
        document.body.appendChild(link);
        link.click();
        
        console.log('Download click triggered');
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          console.log('Cleanup completed');
        }, 100);
        
        console.log('Download process completed successfully');
      } else {
        throw new Error('Invalid image data format');
      }

    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error.message}. Please try again.`);
    }
  };
  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center animate-slide-up">
          {/* Success icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-accent mx-auto mb-8 flex items-center justify-center shadow-accent animate-pulse-soft">
            <CheckCircle className="w-12 h-12 text-accent-foreground" />
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            All Done!
          </h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            {wantsPrint
              ? "Your order has been confirmed. You'll receive a confirmation email shortly with tracking information."
              : "Your professional ID photo is ready for download. Check your email for the high-resolution files."}
          </p>

          {/* Status cards */}
          <div className="space-y-4 mb-10">
            <div className="bg-card rounded-2xl p-5 shadow-card flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-blue-soft/20 flex items-center justify-center flex-shrink-0">
                <Download className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Digital Copy Ready</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your professional ID photo is ready for download
                </p>
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDownload();
                  }}
                  className="w-full"
                  type="button"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Now
                </Button>
              </div>
            </div>

            {wantsPrint && (
              <div className="bg-card rounded-2xl p-5 shadow-card flex items-center gap-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Prints on the Way</h3>
                  <p className="text-sm text-muted-foreground">
                    Estimated delivery: 3-5 business days
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-4">
            {onBack && (
              <Button 
                variant="outline" 
                size="lg" 
                onClick={onBack}
                className="w-full"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Previous Step
              </Button>
            )}
            
            <Button variant="hero" size="xl" onClick={onStartOver}>
              Create Another Photo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
