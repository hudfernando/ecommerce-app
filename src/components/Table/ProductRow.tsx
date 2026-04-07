'use client';

import { useCart } from '@/context/CartContext';
import { QuantitySelector } from '../QuantitySelector';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ProductRowProps {
  product: Product;
}

export function ProductRow({ product }: ProductRowProps) {
  const { addItemToCart, cartItems } = useCart();

  const getInitialQuantity = (productCodigo: number): number => {
    const cartItem = cartItems.find((item) => item.codigo === productCodigo);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleQuantityChange = (newQuantity: number) => {
    addItemToCart(product, newQuantity - getInitialQuantity(product.codigo));
  };

  return (
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
      <TableCell className="text-left">{formatCurrency(product.preco)}</TableCell>
      <TableCell className="text-left">{product.desconto ? `${product.desconto.toFixed(2)}%` : '-'}</TableCell>
      <TableCell className="text-left font-medium">
        <span className={product.emEstoque ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(product.predesc || product.preco)}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <QuantitySelector
          initialQuantity={getInitialQuantity(product.codigo)}
          onQuantityChange={handleQuantityChange}
          max={product.emEstoque ? 999 : 0}
        />
      </TableCell>
    </TableRow>
  );
}