// components/ProductSearchFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Filters } from '@/lib/types';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface ProductSearchFiltersProps {
  onFilterChange: (filters: Filters) => void;
  className?: string;
}

export function ProductSearchFilters({ onFilterChange, className }: ProductSearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [codeFilter, setCodeFilter] = useState<string>('');
  const [fabricFilter, setFabricFilter] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedCodeFilter = useDebounce(codeFilter, 300);
  const debouncedFabricFilter = useDebounce(fabricFilter, 300);

  useEffect(() => {
    onFilterChange({
      searchTerm: debouncedSearchTerm,
      codeFilter: debouncedCodeFilter,
      fabricFilter: debouncedFabricFilter
    });
  }, [debouncedSearchTerm, debouncedCodeFilter, debouncedFabricFilter, onFilterChange]);

  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-4xl", className)}>
      <Input
        type="text"
        placeholder="Buscar produto (ex: anador 5)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 min-w-[200px]"
        aria-label="Buscar produtos"
      />
      <Input
        type="text"
        placeholder="Filtrar por Código"
        value={codeFilter}
        onChange={(e) => setCodeFilter(e.target.value)}
        className="flex-1 min-w-[180px]"
        aria-label="Filtrar por código"
      />
      <Input
        type="text"
        placeholder="Filtrar por Fabricante"
        value={fabricFilter}
        onChange={(e) => setFabricFilter(e.target.value)}
        className="flex-1 min-w-[180px]"
        aria-label="Filtrar por fabricante"
      />
    </div>
  );
}