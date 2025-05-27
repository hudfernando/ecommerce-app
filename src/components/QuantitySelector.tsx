// components/QuantitySelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  initialQuantity?: number;
  onQuantityChange: (newQuantity: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  initialQuantity = 0,
  onQuantityChange,
  min = 0,
  max = 999,
  className,
}: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const handleIncrease = () => {
    const newQuantity = Math.min(quantity + 1, max);
    updateQuantity(newQuantity);
  };

  const handleDecrease = () => {
    const newQuantity = Math.max(quantity - 1, min);
    updateQuantity(newQuantity);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === '') {
      setQuantity(min);
      onQuantityChange(min);
      return;
    }

    const numValue = Number.parseInt(value, 10);
    if (!Number.isNaN(numValue)) {
      const clampedValue = Math.min(Math.max(numValue, min), max);
      setQuantity(clampedValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (quantity < min) {
      updateQuantity(min);
    } else if (quantity > max) {
      updateQuantity(max);
    } else {
      onQuantityChange(quantity);
    }
  };

  const updateQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDecrease}
        className="h-8 w-8"
        disabled={quantity <= min}
        aria-label="Diminuir quantidade"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="number"
        value={isFocused ? quantity.toString() : quantity}
        onChange={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className="w-12 text-center h-8 px-2"
        min={min}
        max={max}
        aria-label="Quantidade"
      />
      <Button
        variant="outline"
        size="icon"
        onClick={handleIncrease}
        className="h-8 w-8"
        disabled={quantity >= max}
        aria-label="Aumentar quantidade"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}