// lib/types.ts

export interface Product {
  id: string;
  Selecionar: boolean;
  Código: string;
  Descrição: string;
  Fabricante: string;
  Preço: number;
  Desconto: string; // Ou number se preferir converter para número
  'Preço c/ Desconto': number;
  EmEstoque: boolean;
  // Adicione outras propriedades se o seu mock de dados tiver
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Filters {
  searchTerm: string;
  codeFilter: string;
  fabricFilter: string; 
}

export interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (product: Product, quantity: number) => void;
  removeItemFromCart: (productId: string) => void;
  updateItemQuantity: (productId: string, newQuantity: number) => void;
  calculateTotal: () => number;
}