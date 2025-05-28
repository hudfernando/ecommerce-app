'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/http/get-products';
import type { Product, Filters } from '@/lib/types';
import { ProductTableHeader } from './ProductTableHeader';
import { ProductSearchFilters } from './ProductSearchFilters';
import { ProductTableBody } from './ProductTableBody';
import { ProductTableSkeleton } from './ProductTableSkeleton';
import { ProductTableError } from './ProductTableError';
import { useGlobalLoading } from '@/context/GlobalLoadingContext';

export function ProductList() {
  const { setLoading } = useGlobalLoading();
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    codeFilter: '',
    fabricFilter: '',
  });

  const { data: products, isFetching, isError, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
      return new Promise(async (resolve, reject) => {
        setTimeout(async () => {
          try {
            const data = await getProducts();
            resolve(data);
          } catch (err) {
            console.error('Erro ao buscar produtos:', err);
            reject(err);
          }
        }, 3000);
      });
    },
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching, setLoading]);

  const initialProducts = products || [];

  const filteredProducts = useMemo(() => {
    let currentFiltered = initialProducts;
    if (filters.searchTerm) {
      const lowerSearchTerm = filters.searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (product) => product.descricao.toLowerCase().includes(lowerSearchTerm)
      );
    }
    if (filters.codeFilter) {
      const lowerCodeFilter = filters.codeFilter.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (product) => String(product.codigo).toLowerCase().includes(lowerCodeFilter)
      );
    }
    if (filters.fabricFilter) {
      const lowerFabricFilter = filters.fabricFilter.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (product) => product.descricaoFab.toLowerCase().includes(lowerFabricFilter)
      );
    }
    return currentFiltered;
  }, [initialProducts, filters]);

  const totalProducts = initialProducts.length;
  const displayedProducts = filteredProducts.length;

  if (isFetching) {
    return <ProductTableSkeleton />;
  }

  if (isError) {
    return <ProductTableError error={error} />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <ProductTableHeader displayedProducts={displayedProducts} totalProducts={totalProducts} />
      <ProductSearchFilters onFilterChange={setFilters} />
      <ProductTableBody products={filteredProducts} />
    </div>
  );
}