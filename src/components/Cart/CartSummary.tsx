'use client';

import { useCart } from '@/context/CartContext';
import { CartIcon } from './CartIcon';
import { CartTotal } from './CartTotal';
import { CartLink } from './CartLink';

export function CartSummary() {
  const { cartItems, calculateTotal } = useCart();
  const totalItems = cartItems.reduce((acc: number, item) => acc + item.quantity, 0);
  const totalValue = calculateTotal();

  return (
    <div className="fixed top-4 right-4 z-60">
      <CartLink>
        <CartIcon totalItems={totalItems} />
        <CartTotal totalValue={totalValue} />
      </CartLink>
    </div>
  );
}