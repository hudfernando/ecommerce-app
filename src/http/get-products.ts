// app/http/get-products.ts
'use server'; // Mantenha isso, pois é um Server Action para chamadas de API

import { Product } from '@/lib/types';
import { api } from './api';

interface RawProductApiResponse {
  codigo: number;
  descricao: string;
  descricaoFab: string;
  preco: number;
  desconto: number | null;
  predesc: number | null;
  emEstoque: boolean;
}

export async function getProducts(): Promise<Product[]> {
  try {
    const rawProducts: RawProductApiResponse[] = await api
      .get('Produto/produtos')
      .json<RawProductApiResponse[]>();

    const sanitizedProducts: Product[] = rawProducts.map((rawProduct) => {
      const preco = Number(rawProduct.preco);
      const desconto = rawProduct.desconto !== undefined && rawProduct.desconto !== null
        ? Number(rawProduct.desconto)
        : undefined;
      const predesc = rawProduct.predesc !== undefined && rawProduct.predesc !== null
        ? Number(rawProduct.predesc)
        : undefined;

      return {
        codigo: Number(rawProduct.codigo),
        descricao: rawProduct.descricao,
        descricaoFab: rawProduct.descricaoFab,
        preco: isNaN(preco) ? 0 : preco,
        desconto: (desconto === undefined || isNaN(desconto)) ? undefined : desconto,
        predesc: (predesc === undefined || isNaN(predesc)) ? undefined : predesc,
        emEstoque: Boolean(rawProduct.emEstoque),
      };
    });

    console.log('[getProducts] Produtos sanitizados carregados:', sanitizedProducts.length);
    return sanitizedProducts;
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
}