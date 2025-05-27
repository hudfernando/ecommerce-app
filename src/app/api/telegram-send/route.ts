// src/app/api/telegram-send/route.ts

import { NextResponse } from 'next/server';

// Certifique-se de que estas variáveis de ambiente estão configuradas no .env.local
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não estão configurados nas variáveis de ambiente.');
    return NextResponse.json(
      { error: 'Configuração do Telegram faltando.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { messageText, userName } = body; // Exemplo de dados que você pode enviar

    // Construa a mensagem que será enviada
    const textToSend = `Nova Mensagem de Contato!\n\nNome: ${userName || 'Convidado'}\nMensagem: ${messageText || 'Nenhuma mensagem fornecida.'}`;

    // Codifica a mensagem para a URL
    const encodedText = encodeURIComponent(textToSend);

    // URL da API do Telegram para enviar mensagens
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodedText}`;

    const response = await fetch(telegramApiUrl, {
      method: 'POST', // Geralmente POST é preferido para sendMessage, mas GET também funciona para casos simples
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro ao enviar mensagem para o Telegram:', data);
      return NextResponse.json(
        { error: 'Erro ao enviar mensagem para o Telegram.', details: data },
        { status: 500 }
      );
    }

    console.log('Mensagem enviada para o Telegram:', data);
    return NextResponse.json({ message: 'Mensagem enviada com sucesso para o Telegram!', data });
  } catch (error) {
    console.error('Erro na API Route do Telegram:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}