'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CartItem } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useGlobalLoading } from '@/context/GlobalLoadingContext';

interface OrderFormData {
  cnpj: string;
  observacoes: string;
}

export default function OrderPage() {
  const [formData, setFormData] = useState<OrderFormData>({ cnpj: '', observacoes: '' });
  const { cartItems, calculateTotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { setLoading } = useGlobalLoading();
  const totalValue = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-8 max-w-xl text-center mt-16 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Seu carrinho está vazio!</h1>
        <p className="text-lg text-gray-600 mb-6">Não há itens para finalizar o pedido.</p>
        <Button onClick={() => router.push('/')}>Voltar às Compras</Button>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFinalizeOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true); // Ativar o overlay global
    toast.info('Enviando pedido para o Telegram...', { duration: 3000 });

    if (!formData.cnpj) {
      toast.error('Por favor, preencha todos os campos obrigatórios (CNPJ).');
      setIsSubmitting(false);
      setLoading(false);
      return;
    }

    let telegramMessage = "*Novo Pedido Recebido!* \n\n";
    telegramMessage += `*CNPJ / Codigo:* ${formData.cnpj}\n`;
    if (formData.observacoes) {
      telegramMessage += `*Observações:* ${formData.observacoes}\n`;
    }
    telegramMessage += "\n*Itens do Pedido:* \n\n";
    cartItems.forEach((item: CartItem) => {
      const itemPrice = formatCurrency((item.predesc || item.preco) * item.quantity);
      telegramMessage += ` Codigo: ${item.codigo} \n Produto: ${item.descricao} \n Quantidade: ${item.quantity} \n ValorUn: ${item.predesc}\n ValorTot: ${itemPrice}\n\n`;
    });
    telegramMessage += `\n*Total:* ${formatCurrency(totalValue)}\n`;
    telegramMessage += `*Data/Hora:* ${new Date().toLocaleString('pt-BR')}\n`;

    try {
      const response = await fetch('/api/telegram-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageText: telegramMessage,
          userName: formData.cnpj,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Pedido finalizado com sucesso! Notificação enviada via Telegram.');
        queryClient.invalidateQueries({ queryKey: ['products'] });
        clearCart();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Atraso para feedback
      } else {
        toast.error(`Erro ao enviar notificação para o Telegram: ${data.error || 'Erro desconhecido'}`);
        console.error('Erro da API do Telegram:', data.error);
      }
    } catch (err) {
      toast.error('Erro de conexão ou requisição ao enviar notificação.');
      console.error('Erro de rede:', err);
    } finally {
      setIsSubmitting(false);
      setLoading(false); // Desativar o overlay global
      router.push('/');
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl bg-gray-50 rounded-lg shadow-md mt-16 mb-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Finalizar Pedido</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
            <CardDescription>Preencha seus dados para finalizar a compra.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFinalizeOrder} className="space-y-4">
              <div>
                <Label htmlFor="cnpj">Código ou CNPJ</Label>
                <Input id="cnpj" type="text" value={formData.cnpj} onChange={handleInputChange} required disabled={isSubmitting} />
              </div>
              <div>
                <Label htmlFor="observacoes">Observações (opcional)</Label>
                <Textarea id="observacoes" value={formData.observacoes} onChange={handleInputChange} rows={2} disabled={isSubmitting} />
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
            <CardDescription>Confira os itens do seu carrinho.</CardDescription>
          </CardHeader>
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
          <CardFooter className="flex flex-col gap-4">
            <Button
              onClick={(e) => handleFinalizeOrder(e as unknown as React.FormEvent<HTMLFormElement>)}
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
        </Card>
      </div>
    </div>
  );
}