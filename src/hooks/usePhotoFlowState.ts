import { useState, useEffect } from 'react';
import type { DocumentType } from '@/pages/Index';
import type { PhotoResult } from '@/hooks/use-photo-job';

export interface PhotoFlowState {
  step: number;
  capturedPhoto: string | null;
  documentType: DocumentType | null;
  selectedVariation: number | null;
  selectedVariationData: PhotoResult | null;
  wantsPrint: boolean;
  deliveryAddress: string;
  isDemoMode: boolean;
}

const STORAGE_KEY = 'photoFlowState';

export const usePhotoFlowState = () => {
  const [state, setState] = useState<PhotoFlowState>(() => {
    // Load from localStorage on initial render
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore parsing errors
    }
    
    return {
      step: 0,
      capturedPhoto: null,
      documentType: null,
      selectedVariation: null,
      selectedVariationData: null,
      wantsPrint: false,
      deliveryAddress: '',
      isDemoMode: false,
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<PhotoFlowState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    const resetState: PhotoFlowState = {
      step: 0,
      capturedPhoto: null,
      documentType: null,
      selectedVariation: null,
      selectedVariationData: null,
      wantsPrint: false,
      deliveryAddress: '',
      isDemoMode: state.isDemoMode, // Preserve demo mode
    };
    setState(resetState);
  };

  return {
    state,
    updateState,
    resetState,
  };
};
