'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface ClientInfoFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  formData: { cnpj: string; observacoes: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function ClientInfoForm({ onSubmit, isSubmitting, formData, onChange }: ClientInfoFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cnpj">Código ou CNPJ</Label>
        <Input id="cnpj" type="text" value={formData.cnpj} onChange={onChange} required disabled={isSubmitting} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações (opcional)</Label>
        <Textarea id="observacoes" value={formData.observacoes} onChange={onChange} rows={2} disabled={isSubmitting} />
      </div>
    </form>
  );
}