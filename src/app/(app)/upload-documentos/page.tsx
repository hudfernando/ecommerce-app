// app/upload-documentos/page.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Image, XCircle, UploadCloud, Loader2 } from 'lucide-react'; // Ícones para tipos de arquivo e loading
import { toast } from 'sonner';

export default function UploadDocumentosPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Referência para resetar o input de arquivo

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(file => {
        const fileType = file.type;
        const isValidType = fileType.startsWith('image/jpeg') || fileType.startsWith('image/png') || fileType === 'application/pdf';
        if (!isValidType) {
          toast.error(`Tipo de arquivo inválido: ${file.name}. Apenas PDF, JPG e PNG são permitidos.`);
        }
        return isValidType;
      });
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    // Se todos os arquivos forem removidos, resetar o input
    if (selectedFiles.length === 1 && fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    // biome-ignore lint/style/useTemplate: <explanation>
    // biome-ignore lint/style/useExponentiationOperator: <explanation>
        return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error('Por favor, selecione pelo menos um documento para enviar.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();

    selectedFiles.forEach(file => {
      formData.append('documents', file); // 'documents' é o nome do campo que a API espera
    });

    try {
      // Chamada para a rota de API que envia ao Telegram
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
        // Não defina Content-Type, o navegador faz isso automaticamente com FormData
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Documentos enviados com sucesso para o Telegram!');
        setSelectedFiles([]); // Limpa os arquivos selecionados
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reseta o input de arquivo
        }
      } else {
        toast.error(result.error || 'Erro ao enviar documentos para o Telegram.');
        console.error('Erro na resposta da API:', result.error);
      }
    } catch (error) {
      toast.error('Erro de rede ou ao processar o envio dos documentos.');
      console.error('Erro ao enviar documentos:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl bg-white rounded-lg shadow-md mt-16 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800 text-center">
            Enviar Documentos
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Envie Alvará, CRF, AFE (PDF, JPG, PNG) para o Telegram.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="documents" className="flex items-center gap-2 mb-2 text-lg font-medium cursor-pointer">
                <UploadCloud className="w-6 h-6" /> Selecionar Arquivos
              </Label>
              <Input
                id="documents"
                type="file"
                multiple // Permite selecionar múltiplos arquivos
                accept=".pdf,.jpg,.jpeg,.png" // Tipos de arquivo aceitos
                onChange={handleFileChange}
                ref={fileInputRef}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-3 p-4 border rounded-md bg-gray-50">
                <h3 className="text-md font-semibold text-gray-700">Arquivos Selecionados:</h3>
                <ul className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    <li key={file.name + index} className="flex items-center justify-between p-2 border rounded-md bg-white shadow-sm">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <span className="font-medium text-gray-800">{file.name}</span>
                          <span className="text-sm text-gray-500 ml-2">({formatFileSize(file.size)})</span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={isUploading || selectedFiles.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <UploadCloud className="h-5 w-5" />
                  Enviar para Telegram
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}