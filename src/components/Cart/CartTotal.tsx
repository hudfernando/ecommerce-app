'use client';

import { useCart } from '@/context/CartContext';

interface CartTotalProps {
  totalValue: number;
}

export function CartTotal({ totalValue }: CartTotalProps) {
  return (
    <span className="font-semibold text-lg">
      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
    </span>
  );
}