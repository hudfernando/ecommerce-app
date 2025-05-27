// app/page.tsx
import { products } from '@/lib/data';
import { ProductTable } from '@/components/ProductTable';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-100">
      <ProductTable initialProducts={products} />
    </main>
  );
}