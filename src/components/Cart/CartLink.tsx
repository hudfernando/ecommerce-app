'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CartLinkProps {
  children: React.ReactNode;
}

export function CartLink({ children }: CartLinkProps) {
  return (
    <Button asChild variant="default" className="relative pr-6">
      <Link href="/cart">{children}</Link>
    </Button>
  );
}