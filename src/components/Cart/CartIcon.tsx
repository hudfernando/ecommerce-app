'use client';

import { ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';

interface CartIconProps {
  totalItems: number;
}

export function CartIcon({ totalItems }: CartIconProps) {
  return (
    <>
      <ShoppingCart className="h-5 w-5 mr-2" />
      {totalItems > 0 && (
        <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center text-xs font-bold" variant="destructive">
          {totalItems}
        </Badge>
      )}
    </>
  );
}