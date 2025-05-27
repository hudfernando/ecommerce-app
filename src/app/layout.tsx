// app/layout.tsx
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { CartSummary } from '@/components/CartSummary';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'E-commerce Frontend',
  description: 'Um frontend de e-commerce com Next.js, Tailwind CSS e Shadcn/ui',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className="light">
      <body className={`${inter.className} antialiased`}>
        <CartProvider>
          {children}
          <CartSummary />
          <Toaster richColors position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}