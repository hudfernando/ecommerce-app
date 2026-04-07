// components/QueryProvider.tsx
'use client'; // MUITO IMPORTANTE: Marca este componente como um Client Component

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Crie uma instância do QueryClient *fora* do componente
// para que ela não seja recriada em cada renderização
const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}