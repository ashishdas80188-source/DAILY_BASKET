import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, calculateCartDTO } from '../services/cartService';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('dailybasket_cart');
    return saved ? JSON.parse(saved) : calculateCartDTO([]);
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('dailybasket_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, quantity = 1, showFeedback = true) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex(
        (i) => i.productId === product.id || i.id === product.id
      );

      let updatedItems = [...prevCart.items];

      if (existingItemIndex > -1) {
        const item = updatedItems[existingItemIndex];
        const newQty = item.quantity + quantity;
        updatedItems[existingItemIndex] = {
          ...item,
          quantity: newQty,
        };
      } else {
        updatedItems.push({
          id: Date.now(),
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          productUnit: product.unit,
          imageUrl: product.imageUrl,
          originalPrice: Number(product.originalPrice || product.discountPrice),
          discountPrice: Number(product.discountPrice),
          discountPercentage: product.discountPercentage || 0,
          quantity: quantity,
          stockQuantity: product.stockQuantity || 50,
          inStock: true,
        });
      }

      const calculated = calculateCartDTO(updatedItems);
      return calculated;
    });

    if (showFeedback) {
      addToast(`${product.name} added to your basket!`, 'success', 2200);
    }
  }, [addToast]);

  const updateQuantity = useCallback((productId, quantity) => {
    setCart((prevCart) => {
      let updatedItems;
      if (quantity <= 0) {
        updatedItems = prevCart.items.filter(
          (i) => i.productId !== productId && i.id !== productId
        );
      } else {
        updatedItems = prevCart.items.map((item) => {
          if (item.productId === productId || item.id === productId) {
            return { ...item, quantity };
          }
          return item;
        });
      }
      return calculateCartDTO(updatedItems);
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prevCart) => {
      const itemToRemove = prevCart.items.find(
        (i) => i.productId === productId || i.id === productId
      );
      const updatedItems = prevCart.items.filter(
        (i) => i.productId !== productId && i.id !== productId
      );
      if (itemToRemove) {
        addToast(`${itemToRemove.productName} removed from basket`, 'info', 2000);
      }
      return calculateCartDTO(updatedItems);
    });
  }, [addToast]);

  const clearCart = useCallback(() => {
    setCart(calculateCartDTO([]));
    localStorage.removeItem('dailybasket_cart');
  }, []);

  const getItemQuantity = useCallback((productId) => {
    const item = cart.items.find(
      (i) => i.productId === productId || i.id === productId
    );
    return item ? item.quantity : 0;
  }, [cart.items]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems: cart.totalItems,
        subtotal: cart.subtotal,
        deliveryFee: cart.deliveryFee,
        finalTotal: cart.finalTotal,
        totalSavings: cart.totalSavings,
        eligibleForFreeDelivery: cart.eligibleForFreeDelivery,
        freeDeliveryThreshold: cart.freeDeliveryThreshold,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantity,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
