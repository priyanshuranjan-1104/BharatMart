import React from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/products/ProductCard";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const { products } = useWishlist();

  if (products.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Heart className="mx-auto h-14 w-14 text-muted-foreground" strokeWidth={1.25} />
        <h1 className="brand-serif text-4xl font-semibold mt-6">Your wishlist is empty</h1>
        <p className="mt-2 text-muted-foreground">Save products you love — they'll be right here.</p>
        <Link
          to="/products"
          className="inline-block mt-8 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <h1 className="brand-serif text-4xl font-semibold tracking-tight mb-8" data-testid="wishlist-title">
        Wishlist · {products.length}
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </div>
  );
}
