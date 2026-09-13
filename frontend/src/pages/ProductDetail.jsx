import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api, formatApiError } from "@/lib/api";
import { formatINR, formatCount } from "@/lib/format";
import RatingStars from "@/components/products/RatingStars";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { Heart, ShoppingBag, Truck, ShieldCheck, RotateCcw, MapPin, Zap } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState("");

  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [postingReview, setPostingReview] = useState(false);

  useEffect(() => {
    setData(null);
    setSelectedImg(0);
    setQty(1);
    api.get(`/products/${id}`).then((r) => setData(r.data)).catch(() => setData({ error: true }));
    window.scrollTo(0, 0);
  }, [id]);

  if (!data) {
    return <div className="min-h-[60vh] grid place-items-center text-muted-foreground">Loading product…</div>;
  }
  if (data.error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="brand-serif text-3xl">Product not found</div>
        <Link to="/products" className="inline-block mt-4 rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium">
          Continue shopping
        </Link>
      </div>
    );
  }

  const { product, reviews } = data;
  const isWishlisted = has(product.id);

  const checkPincode = () => {
    if (/^\d{6}$/.test(pincode)) {
      setPincodeMsg(`Delivery to ${pincode} by ${new Date(Date.now() + 3 * 86400000).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}`);
    } else {
      setPincodeMsg("Enter a valid 6-digit PIN code");
    }
  };

  const buyNow = async () => {
    const res = await addItem(product.id, qty);
    if (res.ok) navigate("/checkout");
    else if (res.needsAuth) navigate("/login", { state: { from: `/product/${id}` } });
  };

  const submitReview = async () => {
    if (!user) { navigate("/login"); return; }
    if (!reviewText.trim()) { toast.error("Write a review first"); return; }
    setPostingReview(true);
    try {
      const { data: r } = await api.post(`/products/${id}/reviews`, {
        rating: reviewRating, comment: reviewText.trim(),
      });
      setData((d) => ({ ...d, reviews: [r, ...d.reviews] }));
      setReviewText("");
      setReviewRating(5);
      toast.success("Review posted");
    } catch (e) {
      toast.error(formatApiError(e));
    } finally {
      setPostingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-10">
      <nav className="text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-1">/</span>
        <Link to={`/category/${product.category.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`} className="hover:text-foreground">
          {product.category}
        </Link>
        <span className="mx-1">/</span>
        <span className="text-foreground line-clamp-1 inline-block max-w-[50%] align-bottom">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12">
        {/* Image gallery */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="aspect-square bg-secondary border border-border rounded-2xl overflow-hidden">
            <img
              src={product.images[selectedImg]}
              alt={product.name}
              className="h-full w-full object-cover"
              data-testid="product-main-image"
            />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`h-16 w-16 rounded-lg overflow-hidden border ${
                    i === selectedImg ? "border-primary border-2" : "border-border"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="overline text-muted-foreground">{product.brand}</div>
              <h1 className="brand-serif text-2xl sm:text-3xl font-semibold mt-1 leading-tight" data-testid="product-name">
                {product.name}
              </h1>
            </div>
            <button
              onClick={() => toggle(product)}
              data-testid="detail-wishlist-toggle"
              className="h-11 w-11 grid place-items-center rounded-full border border-border hover:border-foreground"
              aria-label="Toggle wishlist"
            >
              <Heart size={18} className={isWishlisted ? "fill-primary text-primary" : ""} />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-foreground text-background text-xs font-bold px-2 py-1 rounded">
              {product.rating.toFixed(1)} ★
            </span>
            <span className="text-sm text-muted-foreground">{formatCount(product.rating_count)} ratings</span>
            {product.is_bestseller && (
              <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded">BESTSELLER</span>
            )}
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-bold" data-testid="product-detail-price">{formatINR(product.price)}</span>
              {product.original_price > product.price && (
                <>
                  <span className="text-lg text-muted-foreground price-line-through">
                    {formatINR(product.original_price)}
                  </span>
                  <span className="text-sm font-bold text-[hsl(160,60%,35%)]">
                    {product.discount}% off
                  </span>
                </>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</div>
          </div>

          <div className="mt-6">
            <div className="overline mb-2">Highlights</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <div className="overline mb-2">Deliver to</div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-muted-foreground" />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter PIN code"
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                className="border border-border rounded-full px-4 py-2 text-sm outline-none focus:border-primary w-40"
                data-testid="pincode-input"
              />
              <button
                onClick={checkPincode}
                className="text-sm font-semibold underline underline-offset-4"
                data-testid="pincode-check"
              >
                Check
              </button>
            </div>
            {pincodeMsg && <div className="mt-2 text-xs text-[hsl(160,60%,35%)]">{pincodeMsg}</div>}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border border-border rounded-full">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="h-10 w-10 grid place-items-center"
                data-testid="qty-decrement"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold" data-testid="qty-value">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="h-10 w-10 grid place-items-center"
                data-testid="qty-increment"
              >
                +
              </button>
            </div>
            <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => addItem(product.id, qty)}
              data-testid="detail-add-to-cart"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground py-3 text-sm font-semibold hover:bg-foreground hover:text-background transition-colors"
            >
              <ShoppingBag size={16} /> Add to cart
            </button>
            <button
              onClick={buyNow}
              data-testid="detail-buy-now"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground py-3 text-sm font-semibold hover:bg-[hsl(38,92%,45%)] transition-colors"
            >
              <Zap size={16} /> Buy now
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { icon: Truck, label: "Free ship above ₹500" },
              { icon: ShieldCheck, label: "100% authentic" },
              { icon: RotateCcw, label: "7-day returns" },
            ].map((v) => (
              <div key={v.label} className="border border-border bg-white rounded-xl p-3">
                <v.icon size={18} className="mx-auto text-primary" />
                <div className="text-[11px] text-muted-foreground mt-1">{v.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <div className="overline mb-2">About this product</div>
            <p className="text-sm leading-relaxed text-foreground/85">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 border-t border-border pt-10">
        <div className="flex items-end justify-between mb-6">
          <h2 className="brand-serif text-2xl font-semibold tracking-tight">Customer reviews</h2>
          <div className="text-sm text-muted-foreground">
            <RatingStars rating={product.rating} size={14} /> {product.rating.toFixed(1)} out of 5 · {formatCount(product.rating_count)} ratings
          </div>
        </div>

        {user && (
          <div className="border border-border bg-white rounded-2xl p-5 mb-8">
            <div className="overline mb-2">Share your experience</div>
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => setReviewRating(r)}
                  data-testid={`review-star-${r}`}
                  className={`text-2xl ${r <= reviewRating ? "text-accent" : "text-muted-foreground/40"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What did you like about this product?"
              rows={3}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary resize-none"
              data-testid="review-textarea"
            />
            <div className="mt-3 flex justify-end">
              <button
                onClick={submitReview}
                disabled={postingReview}
                data-testid="review-submit"
                className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-semibold disabled:opacity-60"
              >
                {postingReview ? "Posting…" : "Post review"}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {reviews.length === 0 && (
            <div className="text-sm text-muted-foreground">No reviews yet — be the first!</div>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="border border-border bg-white rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-secondary grid place-items-center text-sm font-semibold">
                  {r.user_name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{r.user_name}</div>
                  <RatingStars rating={r.rating} size={12} />
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
