import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone', // ESTA LINHA É INDISPENSÁVEL
      env: { // Mantenha isso para garantir que suas variáveis de ambiente sejam carregadas no build
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  },
};

export default nextConfig;
