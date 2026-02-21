import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
}

interface PhotoFlowContextType {
  state: PhotoFlowState;
  updateState: (updates: Partial<PhotoFlowState>) => void;
  resetState: () => void;
}

const STORAGE_KEY = 'photoFlowState';

// Keys that are safe to persist (no large base64 data)
const PERSISTABLE_KEYS: (keyof PhotoFlowState)[] = [
  'step',
  'documentType',
  'selectedVariation',
  'wantsPrint',
  'deliveryAddress',
];

const defaultState: PhotoFlowState = {
  step: 1,
  capturedPhoto: null,
  documentType: null,
  selectedVariation: null,
  selectedVariationData: null,
  wantsPrint: false,
  deliveryAddress: '',
};

const PhotoFlowContext = createContext<PhotoFlowContextType | undefined>(undefined);

export const PhotoFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PhotoFlowState>(() => {
    // Load only safe keys from localStorage on initial render
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultState, ...parsed };
      }
    } catch {
      // Ignore parsing errors
    }
    return defaultState;
  });

  // Save only safe keys to localStorage (exclude large base64 data)
  useEffect(() => {
    try {
      const toStore: Partial<PhotoFlowState> = {};
      for (const key of PERSISTABLE_KEYS) {
        toStore[key] = state[key] as never;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      console.warn('Failed to save photo flow state to localStorage:', e);
    }
  }, [state]);

  const updateState = useCallback((updates: Partial<PhotoFlowState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetState = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <PhotoFlowContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </PhotoFlowContext.Provider>
  );
};

export const usePhotoFlowState = () => {
  const context = useContext(PhotoFlowContext);
  if (context === undefined) {
    throw new Error('usePhotoFlowState must be used within a PhotoFlowProvider');
  }
  return context;
};