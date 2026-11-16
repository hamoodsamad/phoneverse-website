'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Smartphone } from '@/types';

interface CompareContextType {
  selectedPhones: Smartphone[];
  addToCompare: (phone: Smartphone) => { success: boolean; message: string };
  removeFromCompare: (phoneId: string) => void;
  isInCompare: (phoneId: string) => boolean;
  clearCompare: () => void;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedPhones, setSelectedPhones] = useState<Smartphone[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phoneverse_compare');
      if (saved) setSelectedPhones(JSON.parse(saved));
    } catch (e) {
      console.warn('Error reading compare storage', e);
    }
  }, []);

  const saveSelected = (phones: Smartphone[]) => {
    setSelectedPhones(phones);
    localStorage.setItem('phoneverse_compare', JSON.stringify(phones));
  };

  const addToCompare = (phone: Smartphone) => {
    if (selectedPhones.some(p => p.id === phone.id)) {
      return { success: false, message: `${phone.name} is already in comparison tray.` };
    }

    if (selectedPhones.length >= 4) {
      return { success: false, message: 'Maximum 4 smartphones can be compared at one time.' };
    }

    const updated = [...selectedPhones, phone];
    saveSelected(updated);
    return { success: true, message: `Added ${phone.name} to compare.` };
  };

  const removeFromCompare = (phoneId: string) => {
    saveSelected(selectedPhones.filter(p => p.id !== phoneId));
  };

  const isInCompare = (phoneId: string) => {
    return selectedPhones.some(p => p.id === phoneId);
  };

  const clearCompare = () => {
    saveSelected([]);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedPhones,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        compareCount: selectedPhones.length
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within CompareProvider');
  return context;
}
