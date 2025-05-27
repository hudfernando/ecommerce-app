// components/ProductTable.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { QuantitySelector } from './QuantitySelector';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { ProductSearchFilters } from './ProductSearchFilters';
import type { CartItem, Product, Filters } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductTableProps {
  initialProducts: Product[];
  isLoading?: boolean;
}

export function ProductTable({ initialProducts, isLoading = false }: ProductTableProps) {
  const { addItemToCart, cartItems } = useCart();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    codeFilter: '',
    fabricFilter: '',
  });

  const getInitialQuantity = (productId: string): number => {
    const cartItem = cartItems.find((item: CartItem) => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  useEffect(() => {
    let currentFiltered = initialProducts;

    // Filtro por termo de busca (descrição)
    if (filters.searchTerm) {
      const lowerSearchTerm = filters.searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (product) =>
          product.Descrição.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Filtro por código
    if (filters.codeFilter) {
      const lowerCodeFilter = filters.codeFilter.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (product) => product.Código.toLowerCase().includes(lowerCodeFilter)
      );
    }

    // Filtro por fabricante (CORRIGIDO)
    if (filters.fabricFilter) {
      const lowerFabricFilter = filters.fabricFilter.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (product) => product.Fabricante.toLowerCase().includes(lowerFabricFilter)
      );
    }

    setFilteredProducts(currentFiltered);
  }, [initialProducts, filters]);

  const handleQuantityChange = (product: Product, newQuantity: number) => {
    addItemToCart(product, newQuantity - getInitialQuantity(product.id));
  };

  const totalProducts = initialProducts.length;
  const displayedProducts = filteredProducts.length;

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
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
              <TableHead className="text-white text-right">Preço</TableHead>
              <TableHead className="text-white text-right">Desconto</TableHead>
              <TableHead className="text-white text-right">Preço Final</TableHead>
              <TableHead className="text-white text-center">Estoque</TableHead>
              <TableHead className="text-white text-center">Quantidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{product.Código}</TableCell>
                <TableCell>{product.Descrição}</TableCell>
                <TableCell>{product.Fabricante}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(product.Preço)}
                </TableCell>
                <TableCell className="text-right">
                  {product.Desconto ? `${product.Desconto}%` : '-'}
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    product.EmEstoque ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(product['Preço c/ Desconto'] || product.Preço)}
                </TableCell>
                <TableCell className="text-center">
                  <div
                    className={`h-4 w-4 rounded-full mx-auto ${
                      product.EmEstoque ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    aria-label={product.EmEstoque ? 'Em Estoque' : 'Fora de Estoque'}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <QuantitySelector
                    initialQuantity={getInitialQuantity(product.id)}
                    onQuantityChange={(newQuantity) =>
                      handleQuantityChange(product, newQuantity)
                    }
                    max={product.EmEstoque ? 999 : 0}
                  />
                </TableCell>
              </TableRow>
            ))}
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-gray-500"
                >
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