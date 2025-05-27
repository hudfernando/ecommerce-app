// app/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { QuantitySelector } from '@/components/QuantitySelector';
import Link from 'next/link';
import { CartItem } from '@/lib/types'; // Importe o tipo CartItem

export default function CartPage() {
  const { cartItems, removeItemFromCart, updateItemQuantity, calculateTotal } = useCart();
  const totalValue = calculateTotal();

  return (
    <div className="container mx-auto p-8 max-w-4xl bg-white rounded-lg shadow-md mt-16 mb-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Seu Carrinho de Compras</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          <p>Seu carrinho está vazio.</p>
          <Link href="/">
            <Button className="mt-4">Voltar às Compras</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-md mb-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Preço Unitário</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item: CartItem) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.Descrição}</TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item['Preço c/ Desconto'] || item.Preço)}
                    </TableCell>
                    <TableCell className="text-center">
                      <QuantitySelector
                        initialQuantity={item.quantity}
                        onQuantityChange={(newQuantity) => updateItemQuantity(item.id, newQuantity)}
                      />
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                        (item['Preço c/ Desconto'] || item.Preço) * item.quantity
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItemFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end items-center mt-6 p-4 border-t border-gray-200">
            <span className="text-2xl font-bold mr-4 text-gray-800">
              Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
            </span>
            <Link href="/order">
              <Button size="lg">Finalizar Pedido</Button>
            </Link>
          </div>

          <div className="flex justify-start mt-4">
            <Link href="/">
              <Button variant="outline">Continuar Comprando</Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}   