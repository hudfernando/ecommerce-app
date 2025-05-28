

// app/http/get-products.ts
'use server'; // Mantenha isso, pois é um Server Action para chamadas de API

import { api } from './api';

interface RawProductApiResponse {
  cdCliente: number;
  descrrazaoicao: string;
  documento: string;
  dataDocumento: string;
  situacao: string;

}


export async function getDocs(){
  try {
    const rawProducts: RawProductApiResponse[] = await api
      .get('Cliente/alvara?vendedor=amarildo')
      .json<RawProductApiResponse[]>();

    console.log(rawProducts);
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw error;
  }
}