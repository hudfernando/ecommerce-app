// app/api/upload-document/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Certifique-se de que estas variáveis de ambiente estão configuradas em .env.local
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não estão configurados.');
    return NextResponse.json(
      { error: 'Configuração do Telegram não encontrada no servidor.' },
      { status: 500 }
    );
  }

  try {
    // 1. Analisar o FormData da requisição
    const formData = await request.formData();
    const documents = formData.getAll('documents'); // 'documents' deve corresponder ao nome no frontend

    if (documents.length === 0) {
      return NextResponse.json({ error: 'Nenhum documento recebido.' }, { status: 400 });
    }

    const uploadPromises = documents.map(async (doc) => {
      if (!(doc instanceof Blob)) {
        console.warn('Item no FormData não é um Blob:', doc);
        return { success: false, fileName: 'Unknown', error: 'Tipo de arquivo inesperado.' };
      }

      const file = doc as File; // Cast para File para acessar .name
      const buffer = Buffer.from(await file.arrayBuffer()); // Converte o Blob para Buffer

      // 2. Preparar FormData para a API do Telegram
      const telegramFormData = new FormData();
      telegramFormData.append('chat_id', TELEGRAM_CHAT_ID);
      telegramFormData.append('document', new Blob([buffer], { type: file.type }), file.name);
      // O campo 'document' e o Blob com nome de arquivo são essenciais

      // 3. Enviar para a API do Telegram
      const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`;

      const telegramResponse = await fetch(telegramApiUrl, {
        method: 'POST',
        body: telegramFormData,
        // O Content-Type é gerado automaticamente pelo FormData quando o body é um FormData
      });

      const telegramResult = await telegramResponse.json();

      if (!telegramResponse.ok) {
        console.error(`Erro ao enviar ${file.name} para o Telegram:`, telegramResult);
        return { success: false, fileName: file.name, error: telegramResult.description || 'Erro desconhecido do Telegram.' };
      }

      console.log(`Documento ${file.name} enviado com sucesso para o Telegram.`);
      return { success: true, fileName: file.name };
    });

    const results = await Promise.all(uploadPromises);

    const successfulUploads = results.filter(r => r.success);
    const failedUploads = results.filter(r => !r.success);

    if (failedUploads.length > 0) {
      return NextResponse.json(
        {
          message: `Concluído com alguns erros. ${successfulUploads.length} enviados, ${failedUploads.length} falharam.`,
          failed: failedUploads,
          successful: successfulUploads,
        },
        { status: 200 } // Status 200 mesmo com falhas parciais é comum
      );
    }

    return NextResponse.json(
      { message: 'Todos os documentos foram enviados com sucesso para o Telegram!' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erro no handler da API de upload:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao processar o upload.' },
      { status: 500 }
    );
  }
}