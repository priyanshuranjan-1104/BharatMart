import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatINR } from "@/lib/format";
import { SlidersHorizontal, X } from "lucide-react";

const PRICE_MIN = 0;
const PRICE_MAX = 150000;

export default function ProductListing() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [minRating, setMinRating] = useState(null);
  const [sort, setSort] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);
  const [categoryLabel, setCategoryLabel] = useState("All products");

  useEffect(() => {
    // Reset filters on route/category change
    setSelectedBrands(new Set());
    setMinRating(null);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
  }, [slug, search]);

  useEffect(() => {
    setLoading(true);
    const params = { sort, limit: 60 };
    if (slug) params.category = slug;
    if (search) params.search = search;
    if (priceRange[0] > PRICE_MIN) params.min_price = priceRange[0];
    if (priceRange[1] < PRICE_MAX) params.max_price = priceRange[1];
    if (minRating) params.min_rating = minRating;

    api.get("/products", { params }).then((r) => {
      let list = r.data.products;
      if (selectedBrands.size > 0) list = list.filter((p) => selectedBrands.has(p.brand));
      setProducts(list);
      setTotal(list.length);
      setLoading(false);
    });
  }, [slug, search, sort, priceRange, minRating, selectedBrands]);

  useEffect(() => {
    if (slug) {
      api.get("/categories").then((r) => {
        const c = r.data.find((x) => x.slug === slug);
        if (c) setCategoryLabel(c.name);
      });
    } else if (search) {
      setCategoryLabel(`Search results for "${search}"`);
    } else {
      setCategoryLabel("All products");
    }
  }, [slug, search]);

  const brands = useMemo(() => {
    const set = new Map();
    products.forEach((p) => set.set(p.brand, (set.get(p.brand) || 0) + 1));
    return Array.from(set.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [products]);

  const toggleBrand = (b) => {
    const next = new Set(selectedBrands);
    if (next.has(b)) next.delete(b); else next.add(b);
    setSelectedBrands(next);
  };

  const filters = (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="overline">Price range</div>
          <button className="text-xs text-muted-foreground underline" onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}>reset</button>
        </div>
        <Slider
          value={priceRange}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={500}
          onValueChange={setPriceRange}
          data-testid="price-range-slider"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatINR(priceRange[0])}</span>
          <span>{formatINR(priceRange[1])}</span>
        </div>
      </div>

      <div>
        <div className="overline mb-3">Brand</div>
        <div className="space-y-2 max-h-52 overflow-y-auto pr-2">
          {brands.length === 0 && <div className="text-xs text-muted-foreground">No brands</div>}
          {brands.map(([b, count]) => (
            <label key={b} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={selectedBrands.has(b)}
                onCheckedChange={() => toggleBrand(b)}
                data-testid={`filter-brand-${b}`}
              />
              <span className="flex-1">{b}</span>
              <span className="text-xs text-muted-foreground">{count}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="overline mb-3">Customer rating</div>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer text-sm">
              <Checkbox
                checked={minRating === r}
                onCheckedChange={(v) => setMinRating(v ? r : null)}
              />
              <span>{r}★ & above</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-xs text-muted-foreground mb-3">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{categoryLabel}</span>
      </nav>

      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <span className="overline text-muted-foreground">Showing {total} results</span>
          <h1 className="brand-serif text-3xl sm:text-4xl font-semibold tracking-tight">{categoryLabel}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="lg:hidden inline-flex items-center gap-2 border border-border rounded-full px-4 py-2 text-sm"
            onClick={() => setShowFilters(true)}
            data-testid="mobile-filter-open"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px] rounded-full" data-testid="sort-select">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Customer rating</SelectItem>
              <SelectItem value="newest">Newest arrivals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-32">{filters}</div>
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-border bg-white rounded-md animate-pulse">
                  <div className="aspect-square bg-secondary" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-secondary rounded w-1/3" />
                    <div className="h-4 bg-secondary rounded w-4/5" />
                    <div className="h-4 bg-secondary rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="border border-border bg-white rounded-2xl p-12 text-center">
              <div className="brand-serif text-2xl mb-2">Nothing here yet</div>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or browse other categories.</p>
              <Link to="/products" className="inline-block mt-4 rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium">
                Browse all products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-background p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="brand-serif text-xl font-semibold">Filters</div>
              <button onClick={() => setShowFilters(false)} className="h-9 w-9 grid place-items-center rounded-full hover:bg-secondary">
                <X size={18} />
              </button>
            </div>
            {filters}
            <button
              className="mt-6 w-full rounded-full bg-primary text-primary-foreground py-2.5 text-sm font-semibold"
              onClick={() => setShowFilters(false)}
            >
              Show {total} results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
