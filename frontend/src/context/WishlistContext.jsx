import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const ids = new Set(products.map((p) => p.id));

  const refresh = useCallback(async () => {
    if (!user) {
      setProducts([]);
      return;
    }
    try {
      const { data } = await api.get("/wishlist");
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = async (product) => {
    if (!user) {
      toast.error("Please sign in to use wishlist");
      return { needsAuth: true };
    }
    try {
      if (ids.has(product.id)) {
        await api.delete(`/wishlist/${product.id}`);
        setProducts((p) => p.filter((x) => x.id !== product.id));
        toast.success("Removed from wishlist");
      } else {
        await api.post(`/wishlist/${product.id}`);
        setProducts((p) => [...p, product]);
        toast.success("Added to wishlist");
      }
    } catch (e) {
      toast.error(formatApiError(e));
    }
    return {};
  };

  const has = (productId) => ids.has(productId);

  return (
    <WishlistContext.Provider value={{ products, has, toggle, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
