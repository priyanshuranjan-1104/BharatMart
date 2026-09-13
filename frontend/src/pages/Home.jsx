import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RotateCcw, BadgePercent } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";

const BRAND_STRIP = [
  "Apple", "Samsung", "Sony", "Nike", "Levi's", "Fabindia", "Titan", "Ray-Ban",
  "Philips", "Prestige", "Mamaearth", "Lakme", "Amul", "Tata", "boAt", "H&M",
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data));
    api.get("/products", { params: { sort: "popularity", limit: 8 } })
      .then((r) => setFeatured(r.data.products));
    api.get("/products", { params: { sort: "price_asc", limit: 4 } })
      .then((r) => setDeals(r.data.products));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* HERO — Bento */}
      <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl bg-primary text-primary-foreground min-h-[420px] subtle-grain grid grid-cols-1 lg:grid-cols-2">
          <div className="relative z-10 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <span className="overline text-primary-foreground/70">The Modern Indian Bazaar</span>
              <h1 className="mt-4 brand-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-tight">
                Discover India&apos;s <span className="italic text-accent">finest</span> — delivered.
              </h1>
              <p className="mt-5 text-primary-foreground/80 text-sm sm:text-base leading-relaxed max-w-md">
                Handpicked electronics, fashion, home essentials, and more. Fair prices in ₹,
                trusted brands, fast delivery across India.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                data-testid="hero-shop-now"
                className="inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-6 py-3 text-sm font-semibold hover:bg-[hsl(38,92%,45%)] transition-colors"
              >
                Shop everything <ArrowRight size={16} />
              </Link>
              <Link
                to="/category/electronics"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium hover:bg-primary-foreground/10 transition-colors"
              >
                Explore electronics
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <img
              src="https://images.pexels.com/photos/5639235/pexels-photo-5639235.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              alt=""
              className="absolute inset-4 rounded-2xl object-cover w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
            />
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-rows-2 gap-4 lg:gap-6">
          <Link
            to="/category/beauty"
            className="relative overflow-hidden rounded-3xl bg-accent text-accent-foreground p-6 min-h-[200px] flex flex-col justify-between group"
          >
            <div>
              <span className="overline text-accent-foreground/70">Beauty · Up to 40% off</span>
              <div className="brand-serif text-3xl font-semibold mt-2 leading-tight">Glow, everyday.</div>
            </div>
            <span className="text-sm font-semibold inline-flex items-center gap-1">
              Shop beauty <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
            <img
              src="https://images.unsplash.com/photo-1600428853876-fb5a850b444f?auto=format&fit=crop&w=800&q=80"
              alt=""
              className="absolute -right-6 -bottom-6 w-40 h-40 object-cover rounded-2xl opacity-70"
            />
          </Link>

          <Link
            to="/category/fashion"
            className="relative overflow-hidden rounded-3xl bg-foreground text-background p-6 min-h-[200px] flex flex-col justify-between group"
          >
            <div>
              <span className="overline text-background/60">Fashion · New arrivals</span>
              <div className="brand-serif text-3xl font-semibold mt-2 leading-tight">Trends that turn heads.</div>
            </div>
            <span className="text-sm font-semibold inline-flex items-center gap-1">
              Shop fashion <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* value props */}
      <section className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Truck, title: "Free delivery", sub: "on orders above ₹500" },
          { icon: ShieldCheck, title: "100% authentic", sub: "brands & sellers" },
          { icon: RotateCcw, title: "Easy returns", sub: "within 7 days" },
          { icon: BadgePercent, title: "Best in ₹", sub: "prices, always" },
        ].map((v) => (
          <div key={v.title} className="border border-border bg-white rounded-xl p-4 flex items-center gap-3">
            <v.icon className="h-5 w-5 text-primary shrink-0" strokeWidth={1.75} />
            <div>
              <div className="text-sm font-semibold">{v.title}</div>
              <div className="text-xs text-muted-foreground">{v.sub}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section className="mt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="overline text-muted-foreground">Browse</span>
            <h2 className="brand-serif text-3xl sm:text-4xl font-semibold tracking-tight">Shop by category</h2>
          </div>
          <Link to="/products" className="text-sm font-medium underline underline-offset-4 hover:text-primary hidden sm:inline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c, i) => (
            <Link
              to={`/category/${c.slug}`}
              key={c.slug}
              data-testid={`category-tile-${c.slug}`}
              className="group card-flat overflow-hidden rounded-2xl fade-in-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="aspect-square overflow-hidden bg-secondary">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.count} items</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="overline text-muted-foreground">Trending in India</span>
            <h2 className="brand-serif text-3xl sm:text-4xl font-semibold tracking-tight">Most loved this week</h2>
          </div>
          <Link to="/products" className="text-sm font-medium underline underline-offset-4 hover:text-primary hidden sm:inline">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>

      {/* Deal banner */}
      <section className="mt-20 rounded-3xl bg-foreground text-background p-8 sm:p-12 relative overflow-hidden subtle-grain">
        <span className="overline text-accent">Festive deals</span>
        <h2 className="brand-serif text-3xl sm:text-5xl font-semibold mt-3 max-w-2xl tracking-tight">
          Under <span className="text-accent italic">₹500</span> — small prices, big smiles.
        </h2>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {deals.map((p, i) => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="bg-background text-foreground rounded-2xl overflow-hidden fade-in-up hover:-translate-y-1 transition-transform"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="aspect-square bg-secondary overflow-hidden">
                <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <div className="text-xs text-muted-foreground truncate">{p.brand}</div>
                <div className="text-sm font-medium line-clamp-1">{p.name}</div>
                <div className="mt-1 font-bold">₹{p.price.toLocaleString("en-IN")}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brands strip */}
      <section className="mt-20 mb-10">
        <div className="overline text-muted-foreground text-center">Trusted brands, everyday prices</div>
        <div className="mt-6 overflow-hidden">
          <div className="flex gap-10 marquee whitespace-nowrap">
            {[...BRAND_STRIP, ...BRAND_STRIP].map((b, i) => (
              <span key={i} className="brand-serif text-2xl text-muted-foreground/60">{b}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
