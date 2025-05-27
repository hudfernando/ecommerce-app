// app/order/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { CartItem } from '@/lib/types'; // Importe o tipo CartItem


interface OrderFormData {
  cnpj: string;
  observacoes: string;
}

export default function OrderPage() {
  const [cnpj, setCnpj] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const { cartItems, calculateTotal, updateItemQuantity } = useCart();
  const router = useRouter();
  const [formData, setFormData] = useState<OrderFormData>({
    cnpj: '',
    observacoes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

    if (!formData.cnpj) {
      toast.error('Por favor, preencha todos os campos obrigatórios (CNPJ).');
      setIsSubmitting(false);
      return;
    }

        // --- Montar a mensagem para o Telegram ---
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
            let telegramMessage = `*Novo Pedido Recebido!* \n\n`;
    telegramMessage += `*CNPJ / Codigo:* ${formData.cnpj}\n`;

    if (formData.observacoes) {
      telegramMessage += `*Observações:* ${formData.observacoes}\n`;
    }
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    telegramMessage += `\n*Itens do Pedido:* \n\n`;
    cartItems.forEach((item: CartItem) => {
        // Formata o preço do item
        const itemPrice = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
            (item['Preço c/ Desconto'] || item.Preço) * item.quantity
        );
        telegramMessage += ` Codigo: ${item.Código} \n Produto: ${item.Descrição} \n Quantidade: ${item.quantity} \n ValorUn: ${item['Preço c/ Desconto']}\n ValorTot: ${itemPrice}\n\n`;
    });
    telegramMessage += `\n*Total:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}\n`;
    telegramMessage += `*Data/Hora:* ${new Date().toLocaleString('pt-BR')}\n`;

    try {
      // --- Chamada para a API Route do Telegram ---
      // Certifique-se de que sua API Route do Telegram está em '/api/telegram-send'
      const response = await fetch('/api/telegram-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageText: telegramMessage, // Envie a mensagem formatada para o Telegram
          userName: formData.cnpj, // Opcional: envie o nome do cliente se sua API Route usar
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Pedido finalizado com sucesso! Notificação enviada via Telegram.');
        // Opcional: Se ainda for enviar e-mail, pode adicionar a chamada aqui
      } else {
        toast.error(`Erro ao enviar notificação para o Telegram: ${data.error || 'Erro desconhecido'}`);
        console.error('Erro da API do Telegram:', data.error);
      }
    } catch (err) {
      toast.error('Erro de conexão ou requisição ao enviar notificação.');
      console.error('Erro de rede:', err);
    } finally {
        // Limpa o carrinho independente do sucesso do envio da notificação
        // biome-ignore lint/complexity/noForEach: <explanation>
                cartItems.forEach((item: CartItem) => updateItemQuantity(item.id, 0));
        setIsSubmitting(false);
        router.push('/'); // Redireciona o usuário para a página inicial
    }

    // Código original do console.log dos dados do pedido (opcional)
    // console.log('Dados do Pedido:', {
    //   ...formData,
    //   items: cartItems,
    //   total: totalValue,
    //   timestamp: new Date().toISOString(),
    // });
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
                <Label htmlFor="cnpj">Codigo ou CNPJ</Label>
                <Input id="cnpj" type="text" value={formData.cnpj} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="observacoes">Observações (opcional)</Label>
                <Textarea id="observacoes" value={formData.observacoes} onChange={handleInputChange} rows={2} />
              </div>
            </form> {/* O formulário é submetido pelo botão na CardFooter */}
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
                <li key={item.id} className="flex justify-between items-center text-sm text-gray-700">
                  <span>{item.Descrição} ({item.quantity}x)</span>
                  <span>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      (item['Preço c/ Desconto'] || item.Preço) * item.quantity
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-t pt-4 mt-4 flex justify-between items-center text-xl font-bold text-gray-800">
              <span>Total do Pedido:</span>
              <span>
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              onClick={(e) => handleFinalizeOrder(e as unknown as React.FormEvent<HTMLFormElement>)} // Força o tipo de evento para o handler do formulário
              disabled={isSubmitting || cartItems.length === 0}
              className="w-full text-lg py-3"
            >
              {isSubmitting ? 'Finalizando Pedido...' : 'Confirmar e Enviar Pedido'}
            </Button>
            <Button variant="outline" onClick={() => router.push('/cart')} className="w-full">
              Voltar ao Carrinho
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}