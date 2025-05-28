'use client';

import { createContext, useContext, useState } from 'react';

interface GlobalLoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(false);

  return (
    <GlobalLoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
}