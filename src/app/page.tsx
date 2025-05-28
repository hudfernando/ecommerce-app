// app/page.tsx (Exemplo de Server Component com prefetching)
// NENHUMA DIRETIVA 'use client' aqui

import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getProducts } from '@/http/get-products'; // Sua Server Action para buscar produtos
import {ProductTable} from '@/components/ProductTable'; // Seu Client Component que usa useQuery

export default async function HomePage() {
  const queryClient = new QueryClient(); // Cria uma nova instância por requisição

  // Prefetch os produtos
  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // Dehydrate o estado do cache para passar ao cliente
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ProductTable />
    </HydrationBoundary>
  );
}