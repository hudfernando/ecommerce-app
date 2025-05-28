'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { CardFooter } from '@/components/ui/card';
import { useState } from 'react';

interface OrderActionsProps {
  onFinalizeOrder: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  cartItems: { length: number };
}

export function OrderActions({ onFinalizeOrder, isSubmitting, cartItems }: OrderActionsProps) {
  const router = useRouter();

  return (
    <CardFooter className="flex flex-col gap-4">
      <Button
        onClick={(e) => onFinalizeOrder(e as unknown as React.FormEvent<HTMLFormElement>)}
        disabled={isSubmitting || cartItems.length === 0}
        className="w-full text-lg py-3 relative"
      >
        {isSubmitting ? (
          <>
            <span className="mr-2">Finalizando Pedido...</span>
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
              <svg className="animate-spin h-5 w-5 inline" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </>
        ) : (
          'Confirmar e Enviar Pedido'
        )}
      </Button>
      <Button variant="outline" onClick={() => router.push('/cart')} className="w-full" disabled={isSubmitting}>
        Voltar ao Carrinho
      </Button>
    </CardFooter>
  );
}