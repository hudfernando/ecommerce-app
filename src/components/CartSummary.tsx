'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CartSummary() {
  const { cartItems, calculateTotal } = useCart();
  const totalItems = cartItems.reduce((acc: number, item) => acc + item.quantity, 0);
  const totalValue = calculateTotal();

  return (
    <div className="fixed top-4 right-4 z-60"> {/* Aumentado para z-60 */}
      <Button asChild variant="default" className="relative pr-6">
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5 mr-2" />
          <span className="font-semibold text-lg">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
          </span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
              {totalItems}
            </span>
          )}
        </Link>
      </Button>
    </div>
  );
}