import React, { createContext, useContext, useCallback, useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const CartContext = createContext(null);

const EMPTY = { items: [], subtotal: 0, shipping: 0, total: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(EMPTY);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setCart(data);
    } catch {
      setCart(EMPTY);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) refresh();
    else setCart(EMPTY);
  }, [user, refresh]);

  const addItem = async (productId, quantity = 1) => {
    if (!user) {
      toast.error("Please sign in to add to cart");
      return { ok: false, needsAuth: true };
    }
    try {
      const { data } = await api.post("/cart/items", { product_id: productId, quantity });
      setCart(data);
      toast.success("Added to cart");
      return { ok: true };
    } catch (e) {
      toast.error(formatApiError(e));
      return { ok: false };
    }
  };

  const updateItem = async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    try {
      const { data } = await api.patch(`/cart/items/${productId}`, { quantity });
      setCart(data);
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/items/${productId}`);
      setCart(data);
      toast.success("Removed from cart");
    } catch (e) {
      toast.error(formatApiError(e));
    }
  };

  const clear = async () => {
    try {
      const { data } = await api.delete(`/cart`);
      setCart(data);
    } catch {}
  };

  const itemCount = cart.items.reduce((n, it) => n + it.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, itemCount, loading, refresh, addItem, updateItem, removeItem, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
