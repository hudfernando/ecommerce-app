'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductRow } from './ProductRow';
import type { Product } from '@/lib/types';

interface ProductTableBodyProps {
  products: Product[];
}

export function ProductTableBody({ products }: ProductTableBodyProps) {
  return (
    <div className="overflow-x-auto border rounded-md">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow className="bg-blue-800 hover:bg-blue-700">
            <TableHead className="text-white">Código</TableHead>
            <TableHead className="text-white">Descrição</TableHead>
            <TableHead className="text-white">Fabricante</TableHead>
            <TableHead className="text-white text-center">Disp.</TableHead>
            <TableHead className="text-white text-center">Preço</TableHead>
            <TableHead className="text-white text-center">Desconto</TableHead>
            <TableHead className="text-white text-center">Preço Final</TableHead>
            <TableHead className="text-white text-center">Quantidade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductRow key={product.codigo} product={product} />
          ))}
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                Nenhum produto encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}