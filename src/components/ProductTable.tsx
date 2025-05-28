'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/http/get-products';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QuantitySelector } from './QuantitySelector';
import { useCart } from '@/context/CartContext';
import { ProductSearchFilters } from './ProductSearchFilters';
import { Skeleton } from '@/components/ui/skeleton';
import type { CartItem, Product, Filters } from '@/lib/types';
import { useGlobalLoading } from '@/context/GlobalLoadingContext';
import { formatCurrency } from '@/lib/utils';

export function ProductTable() {
  const { addItemToCart, cartItems } = useCart();
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
        }, 3000); // Atraso de 3 segundos
      });
    },
    staleTime: 300000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Ativar/desativar o overlay global com base no isFetching
  useEffect(() => {
    setLoading(isFetching);
    return () => setLoading(false); // Desativa o loading ao desmontar
  }, [isFetching, setLoading]);

  const initialProducts = products || [];

  const getInitialQuantity = (productCodigo: number): number => {
    const cartItem = cartItems.find((item: CartItem) => item.codigo === productCodigo);
    return cartItem ? cartItem.quantity : 0;
  };

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

  const handleQuantityChange = (product: Product, newQuantity: number) => {
    addItemToCart(product, newQuantity - getInitialQuantity(product.codigo));
  };

  const totalProducts = initialProducts.length;
  const displayedProducts = filteredProducts.length;

  // Mostra o Skeleton durante isFetching (primeira busca ou refetch)
  if (isFetching) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 bg-red-100 text-red-700 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Erro ao carregar produtos:</h2>
        <p>{error?.message || 'Ocorreu um erro desconhecido.'}</p>
        <p className="mt-2">Por favor, tente recarregar a página.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Tabela de Produtos ({displayedProducts}/{totalProducts})
      </h2>
      <ProductSearchFilters onFilterChange={setFilters} />
      <div className="overflow-x-auto border rounded-md">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-blue-800 hover:bg-blue-700">
              <TableHead className="text-white">Código</TableHead>
              <TableHead className="text-white">Descrição</TableHead>
              <TableHead className="text-white">Fabricante</TableHead>
              <TableHead className="text-white text-center">Disp.</TableHead>
              <TableHead className="text-white text-center">Preço</TableHead>
              <TableHead className="text-white text-center">Desconto</TableHead>
              <TableHead className="text-white text-center">Preço Final</TableHead>
              <TableHead className="text-white text-center">Quantidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.codigo} className="hover:bg-gray-50">
                <TableCell className="font-medium">{product.codigo}</TableCell>
                <TableCell>{product.descricao}</TableCell>
                <TableCell>{product.descricaoFab}</TableCell>
                <TableCell className="text-center">
                  <div
                    className={`h-4 w-4 rounded-full mx-auto ${product.emEstoque ? 'bg-green-500' : 'bg-red-500'}`}
                    title={product.emEstoque ? 'Em Estoque' : 'Fora de Estoque'}
                    aria-label={product.emEstoque ? 'Em Estoque' : 'Fora de Estoque'}
                  />
                </TableCell>
                <TableCell className="text-left">
                  {formatCurrency(product.preco)}
                </TableCell>
                <TableCell className="text-left">
                  {product.desconto ? `${product.desconto.toFixed(2)}%` : '-'}
                </TableCell>
                <TableCell className="text-left font-medium">
                  <span className={product.emEstoque ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(product.predesc || product.preco)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <QuantitySelector
                    initialQuantity={getInitialQuantity(product.codigo)}
                    onQuantityChange={(newQuantity) => handleQuantityChange(product, newQuantity)}
                    max={product.emEstoque ? 999 : 0}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}