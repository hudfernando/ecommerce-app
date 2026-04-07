'use client';

interface ProductTableErrorProps {
  error: Error | null;
}

export function ProductTableError({ error }: ProductTableErrorProps) {
  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Erro ao carregar produtos:</h2>
      <p>{error?.message || 'Ocorreu um erro desconhecido.'}</p>
      <p className="mt-2">Por favor, tente recarregar a página.</p>
    </div>
  );
}