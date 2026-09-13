import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Package, Heart, ShoppingBag, LogOut } from "lucide-react";

export default function Account() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { products: wish } = useWishlist();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground grid place-items-center text-xl font-bold brand-serif">
          {(user?.name || user?.email || "U")[0].toUpperCase()}
        </div>
        <div>
          <h1 className="brand-serif text-3xl font-semibold tracking-tight">Hi, {user?.name || "shopper"}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/orders" className="border border-border bg-white rounded-2xl p-5 hover:border-foreground transition-colors">
          <Package className="h-6 w-6 text-primary" strokeWidth={1.5} />
          <div className="mt-3 brand-serif text-xl font-semibold">Orders</div>
          <div className="text-xs text-muted-foreground mt-1">Track, return or reorder items</div>
        </Link>
        <Link to="/wishlist" className="border border-border bg-white rounded-2xl p-5 hover:border-foreground transition-colors">
          <Heart className="h-6 w-6 text-primary" strokeWidth={1.5} />
          <div className="mt-3 brand-serif text-xl font-semibold">Wishlist</div>
          <div className="text-xs text-muted-foreground mt-1">{wish.length} saved items</div>
        </Link>
        <Link to="/cart" className="border border-border bg-white rounded-2xl p-5 hover:border-foreground transition-colors">
          <ShoppingBag className="h-6 w-6 text-primary" strokeWidth={1.5} />
          <div className="mt-3 brand-serif text-xl font-semibold">Cart</div>
          <div className="text-xs text-muted-foreground mt-1">{itemCount} items ready to buy</div>
        </Link>
      </div>

      <button
        onClick={logout}
        data-testid="account-logout"
        className="mt-10 inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-2 text-sm font-semibold hover:bg-foreground hover:text-background transition-colors"
      >
        <LogOut size={14} /> Sign out
      </button>
    </div>
  );
}
