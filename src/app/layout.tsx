// app/layout.tsx
// NENHUMA DIRETIVA 'use client' aqui, pois é um Server Component

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './provider'; // Importe o seu novo componente Providers

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce Frontend', // Seu título
  description: 'Um frontend de e-commerce com Next.js, Tailwind CSS e Shadcn/ui', // Sua descrição
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}