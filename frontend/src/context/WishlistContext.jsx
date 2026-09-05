import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('dailybasket_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.setItem('dailybasket_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => (item.product?.id || item.id) === product.id);
      if (exists) {
        addToast(`${product.name} removed from Wishlist`, 'info', 2000);
        return prev.filter((item) => (item.product?.id || item.id) !== product.id);
      } else {
        addToast(`${product.name} added to Wishlist!`, 'success', 2000);
        return [...prev, { id: Date.now(), product, createdAt: new Date().toISOString() }];
      }
    });
  }, [addToast]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => (item.product?.id || item.id) === productId);
  }, [wishlist]);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.filter((item) => (item.product?.id || item.id) !== productId));
    addToast('Item removed from wishlist', 'info', 2000);
  }, [addToast]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
