'use client';

import { useGlobalLoading } from '@/context/GlobalLoadingContext';

export function GlobalLoadingOverlay() {
  const { isLoading } = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex flex-col items-center gap-4">
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
          className="animate-spin h-12 w-12 text-white"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span className="text-white text-lg font-semibold">Carregando...</span>
      </div>
    </div>
  );
}