import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { formatINR, formatCount } from "@/lib/format";
import RatingStars from "@/components/products/RatingStars";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const isWishlisted = has(product.id);

  return (
    <div
      className="card-flat group relative fade-in-up"
      style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
      data-testid={`product-card-${product.id}`}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded-full">
              {product.discount}% OFF
            </span>
          )}
          {product.is_bestseller && (
            <span className="absolute top-3 left-3 mt-7 bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded-full">
              BESTSELLER
            </span>
          )}
          <button
            data-testid={`wishlist-toggle-${product.id}`}
            onClick={(e) => {
              e.preventDefault();
              toggle(product);
            }}
            className="absolute top-3 right-3 h-9 w-9 grid place-items-center bg-white/95 rounded-full border border-border hover:border-foreground transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart
              size={16}
              className={isWishlisted ? "fill-primary text-primary" : "text-foreground"}
            />
          </button>
        </div>

        <div className="p-4">
          <div className="overline text-muted-foreground">{product.brand}</div>
          <h3 className="mt-1 font-medium text-sm leading-snug line-clamp-2 min-h-[2.6em]">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={product.rating} size={12} />
            <span className="text-xs text-muted-foreground">
              {product.rating.toFixed(1)} ({formatCount(product.rating_count)})
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold" data-testid={`product-price-${product.id}`}>
              {formatINR(product.price)}
            </span>
            {product.original_price > product.price && (
              <span className="text-xs text-muted-foreground price-line-through">
                {formatINR(product.original_price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          data-testid={`add-to-cart-${product.id}`}
          onClick={() => addItem(product.id, 1)}
          className="w-full rounded-full border border-foreground py-2 text-sm font-semibold hover:bg-foreground hover:text-background transition-colors"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
