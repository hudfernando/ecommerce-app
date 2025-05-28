// lib/types.ts

export interface Product {
  codigo: number; // Este é o ID agora
  descricao: string;
  descricaoFab: string;
  preco: number;
  desconto?: number;
  predesc?: number;
  emEstoque: boolean;
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
  removeItemFromCart: (productId: number) => void; // Mudei para number
  updateItemQuantity: (productId: number, newQuantity: number) => void; // Mudei para number
  calculateTotal: () => number;
  clearCart: () => void; // Adicionei clearCart que já está no seu CartContext
}