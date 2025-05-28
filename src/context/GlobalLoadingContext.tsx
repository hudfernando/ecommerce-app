'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const GlobalLoadingContext = createContext<{ isLoading: boolean; setLoading: (loading: boolean) => void } | undefined>(undefined);

function useGlobalLoadingHook(initialLoading = false) {
  const [isLoading, setLoading] = useState(initialLoading);

  return { isLoading, setLoading };
}

export function GlobalLoadingProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, setLoading } = useGlobalLoadingHook();

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