// context/CartContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Product, CartItem, CartContextType } from '@/lib/types';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Filtra itens com quantidade 0 ou menos ao carregar do localStorage
        const cleanCart = parsedCart.filter((item: CartItem) => item.quantity > 0);
        setCartItems(cleanCart);
      } catch (e) {
        console.error('Failed to parse cart data from localStorage or data corrupted', e);
        localStorage.removeItem('cart'); // Limpa dados corrompidos
        setCartItems([]); // Reseta o carrinho
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isMounted) {
      // Filtra itens com quantidade 0 ou menos antes de salvar no localStorage
      const itemsToSave = cartItems.filter(item => item.quantity > 0);
      localStorage.setItem('cart', JSON.stringify(itemsToSave));
    }
  }, [cartItems, isMounted]);


  // Função para adicionar item ao carrinho ou atualizar quantidade
  const addItemToCart = (product: Product, quantityToAdd: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.codigo === product.codigo);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantityToAdd;
        if (newQuantity <= 0) {
          // Se a nova quantidade for 0 ou menos, remove o item
          return prevItems.filter((item) => item.codigo !== product.codigo);
        }
        // Atualiza a quantidade do item existente
        return prevItems.map((item) =>
          item.codigo === product.codigo ? { ...item, quantity: newQuantity } : item
        );
      } else {
        // Adiciona um novo item, mas apenas se a quantidade for maior que 0
        if (quantityToAdd > 0) {
          return [
            ...prevItems,
            {
              ...product,
              quantity: quantityToAdd,
            },
          ];
        }
        return prevItems; // Não adiciona se a quantidade a adicionar for 0 ou menos
      }
    });
  };

  // Função para remover item do carrinho completamente
  const removeItemFromCart = (productCodigo: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.codigo !== productCodigo));
  };

  // Função para atualizar diretamente a quantidade de um item
  const updateItemQuantity = (productCodigo: number, newQuantity: number) => {
    setCartItems((prevItems) => {
      if (newQuantity <= 0) {
        // Se a nova quantidade for 0 ou menos, remove o item
        return prevItems.filter((item) => item.codigo !== productCodigo);
      }
      // Atualiza a quantidade de um item existente
      return prevItems.map((item) =>
        item.codigo === productCodigo ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.predesc !== undefined && item.predesc !== null ? item.predesc : item.preco;
      return total + price * item.quantity;
    }, 0);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addItemToCart,
      removeItemFromCart,
      updateItemQuantity,
      calculateTotal,
      clearCart,
    }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}