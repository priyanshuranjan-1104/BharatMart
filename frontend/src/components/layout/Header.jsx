import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Heart, ShoppingBag, User, Menu, X, Package, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV = [
  { to: "/category/electronics", label: "Electronics" },
  { to: "/category/fashion", label: "Fashion" },
  { to: "/category/home-kitchen", label: "Home" },
  { to: "/category/beauty", label: "Beauty" },
  { to: "/category/books", label: "Books" },
  { to: "/category/grocery", label: "Grocery" },
];

export default function Header() {
  const [q, setQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { products: wishItems } = useWishlist();

  const submitSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/products?search=${encodeURIComponent(q.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-border">
      {/* top strip */}
      <div className="bg-foreground text-background text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <span className="tracking-wider">Free delivery on orders above ₹500 · COD available</span>
          <span className="hidden sm:inline tracking-wider">Serving all 28 states & 8 UTs</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0" data-testid="header-logo">
          <div className="w-9 h-9 rounded-full bg-primary grid place-items-center text-primary-foreground brand-serif text-xl font-bold">
            B
          </div>
          <div className="hidden sm:block leading-none">
            <div className="brand-serif text-2xl font-bold tracking-tight">BharatMart</div>
            <div className="overline text-[10px] text-muted-foreground mt-0.5">
              Made for India
            </div>
          </div>
        </Link>

        <form
          onSubmit={submitSearch}
          className="hidden md:flex flex-1 max-w-2xl items-center gap-2 border border-border rounded-full pl-5 pr-1 py-1 bg-white"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            data-testid="header-search-input"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            placeholder="Search for products, brands, and more..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            data-testid="header-search-submit"
            type="submit"
            className="rounded-full px-5 py-2 bg-primary text-primary-foreground text-sm font-medium hover:bg-[hsl(244,75%,53%)] transition-colors"
          >
            Search
          </button>
        </form>

        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/wishlist"
            data-testid="header-wishlist-link"
            className="hidden sm:flex relative items-center justify-center h-11 w-11 rounded-full hover:bg-secondary transition-colors"
          >
            <Heart className="h-5 w-5" />
            {wishItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 grid place-items-center">
                {wishItems.length}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            data-testid="header-cart-link"
            className="relative flex items-center justify-center h-11 w-11 rounded-full hover:bg-secondary transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span
                data-testid="cart-badge"
                className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full h-4 min-w-4 px-1 grid place-items-center"
              >
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  data-testid="header-account-menu"
                  className="hidden sm:flex items-center gap-2 h-11 px-3 rounded-full hover:bg-secondary transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">
                    {(user.name || user.email)[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">Hi, {user.name?.split(" ")[0] || "you"}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild data-testid="menu-account">
                  <Link to="/account"><User className="h-4 w-4 mr-2" /> My account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild data-testid="menu-orders">
                  <Link to="/orders"><Package className="h-4 w-4 mr-2" /> Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild data-testid="menu-wishlist">
                  <Link to="/wishlist"><Heart className="h-4 w-4 mr-2" /> Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} data-testid="menu-logout">
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              to="/login"
              data-testid="header-login-btn"
              className="hidden sm:inline-flex items-center gap-1 rounded-full border border-foreground px-4 py-2 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Sign in
            </Link>
          )}

          <button
            className="md:hidden h-11 w-11 grid place-items-center rounded-full hover:bg-secondary"
            onClick={() => setMobileOpen((v) => !v)}
            data-testid="header-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <nav className="hidden md:block border-t border-border">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-6 h-11 overflow-x-auto no-scrollbar">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-sm whitespace-nowrap transition-colors ${
                  isActive ? "text-primary font-semibold" : "text-foreground/70 hover:text-foreground"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <form onSubmit={submitSearch} className="p-4 flex gap-2">
            <input
              className="flex-1 border border-border rounded-full px-4 py-2 text-sm outline-none focus:border-primary"
              placeholder="Search products..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              data-testid="mobile-search-input"
            />
            <button className="rounded-full bg-primary text-primary-foreground px-4 text-sm font-medium">
              Go
            </button>
          </form>
          <div className="grid grid-cols-2 gap-1 px-2 pb-4">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className="py-2 px-3 text-sm rounded-md hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="py-2 px-3 text-sm rounded-md hover:bg-secondary col-span-2 border-t mt-2"
              >
                Sign in / Register
              </Link>
            )}
            {user && (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="py-2 px-3 text-sm rounded-md hover:bg-secondary">Orders</Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="py-2 px-3 text-sm rounded-md hover:bg-secondary">Wishlist</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="py-2 px-3 text-sm rounded-md hover:bg-secondary col-span-2 text-left">Sign out</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
