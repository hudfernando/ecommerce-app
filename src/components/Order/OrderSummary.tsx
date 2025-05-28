'use client';

import { CardContent } from '@/components/ui/card';
import { CartItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface OrderSummaryProps {
  cartItems: CartItem[];
  totalValue: number;
}

export function OrderSummary({ cartItems, totalValue }: OrderSummaryProps) {
  return (
    <CardContent>
      <ul className="space-y-2 mb-4">
        {cartItems.map((item: CartItem) => (
          <li key={item.codigo} className="flex justify-between items-center text-sm text-gray-700">
            <span>{item.descricao} ({item.quantity}x)</span>
            <span>{formatCurrency((item.predesc || item.preco) * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="border-t pt-4 mt-4 flex justify-between items-center text-xl font-bold text-gray-800">
        <span>Total do Pedido:</span>
        <span>{formatCurrency(totalValue)}</span>
      </div>
    </CardContent>
  );
}