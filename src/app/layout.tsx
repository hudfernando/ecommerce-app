import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './provider';
import { GlobalLoadingProvider } from '@/context/GlobalLoadingContext';
import { GlobalLoadingOverlay } from '@/components/GlobalLoadingOverlay';
import { CartSummary } from '@/components/Cart/CartSummary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-commerce Frontend',
  description: 'Um frontend de e-commerce com Next.js, Tailwind CSS e Shadcn/ui',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="light">
      <body className={`${inter.className} antialiased`}>
        <GlobalLoadingProvider>
          <Providers>
            {children}
            <CartSummary />
            <GlobalLoadingOverlay />
          </Providers>
        </GlobalLoadingProvider>
      </body>
    </html>
  );
}