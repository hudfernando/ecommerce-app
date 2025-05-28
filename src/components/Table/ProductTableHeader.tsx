'use client';

interface ProductTableHeaderProps {
  displayedProducts: number;
  totalProducts: number;
}

export function ProductTableHeader({ displayedProducts, totalProducts }: ProductTableHeaderProps) {
  return (
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">
      Tabela de Produtos ({displayedProducts}/{totalProducts})
    </h2>
  );
}