import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/lib/format";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { cart, updateItem, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const goCheckout = () => {
    if (!user) navigate("/login", { state: { from: "/checkout" } });
    else navigate("/checkout");
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-14 w-14 text-muted-foreground" strokeWidth={1.25} />
        <h1 className="brand-serif text-4xl font-semibold mt-6">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Discover thousands of products and fill it up.</p>
        <Link
          to="/products"
          data-testid="empty-cart-shop-btn"
          className="inline-block mt-8 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
      <h1 className="brand-serif text-4xl font-semibold tracking-tight mb-8">Your cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-4">
          {cart.items.map((it) => (
            <div
              key={it.product.id}
              className="border border-border bg-white rounded-2xl p-4 flex gap-4"
              data-testid={`cart-item-${it.product.id}`}
            >
              <Link to={`/product/${it.product.id}`} className="shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-secondary rounded-lg overflow-hidden">
                  <img src={it.product.images[0]} alt={it.product.name} className="h-full w-full object-cover" />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="overline text-muted-foreground">{it.product.brand}</div>
                <Link to={`/product/${it.product.id}`} className="text-sm font-medium hover:text-primary line-clamp-2">
                  {it.product.name}
                </Link>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-base font-bold">{formatINR(it.product.price)}</span>
                  {it.product.original_price > it.product.price && (
                    <span className="text-xs text-muted-foreground price-line-through">
                      {formatINR(it.product.original_price)}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center border border-border rounded-full">
                    <button
                      onClick={() => updateItem(it.product.id, it.quantity - 1)}
                      className="h-8 w-8 grid place-items-center"
                      data-testid={`cart-dec-${it.product.id}`}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{it.quantity}</span>
                    <button
                      onClick={() => updateItem(it.product.id, it.quantity + 1)}
                      className="h-8 w-8 grid place-items-center"
                      data-testid={`cart-inc-${it.product.id}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(it.product.id)}
                    data-testid={`cart-remove-${it.product.id}`}
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-xs text-muted-foreground">Subtotal</div>
                <div className="text-base font-bold">{formatINR(it.line_total)}</div>
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="border border-border bg-white rounded-2xl p-6">
            <div className="overline mb-3">Order summary</div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd data-testid="cart-subtotal">{formatINR(cart.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd data-testid="cart-shipping">{cart.shipping === 0 ? "FREE" : formatINR(cart.shipping)}</dd>
              </div>
              {cart.shipping === 0 && cart.subtotal > 0 && (
                <div className="text-xs text-[hsl(160,60%,35%)]">You unlocked free shipping!</div>
              )}
              <div className="pt-3 border-t border-border flex justify-between items-baseline">
                <dt className="text-sm font-semibold">Total</dt>
                <dd className="text-2xl font-bold" data-testid="cart-total">{formatINR(cart.total)}</dd>
              </div>
            </dl>
            <button
              onClick={goCheckout}
              data-testid="cart-checkout-btn"
              className="mt-6 w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold hover:bg-[hsl(244,75%,53%)] transition-colors"
            >
              Proceed to checkout
            </button>
            <Link
              to="/products"
              className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground"
            >
              or continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
