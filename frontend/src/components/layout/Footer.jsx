import React from "react";
import { Link } from "react-router-dom";

const COLS = [
  {
    title: "Shop",
    links: [
      { to: "/category/electronics", label: "Electronics" },
      { to: "/category/fashion", label: "Fashion" },
      { to: "/category/home-kitchen", label: "Home & Kitchen" },
      { to: "/category/beauty", label: "Beauty" },
      { to: "/category/books", label: "Books" },
      { to: "/category/grocery", label: "Grocery" },
    ],
  },
  {
    title: "Help",
    links: [
      { to: "#", label: "Track your order" },
      { to: "#", label: "Shipping & Returns" },
      { to: "#", label: "Contact us" },
      { to: "#", label: "FAQs" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "#", label: "About BharatMart" },
      { to: "#", label: "Careers" },
      { to: "#", label: "Press" },
      { to: "#", label: "Sustainability" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-accent grid place-items-center text-foreground brand-serif text-xl font-bold">
              B
            </div>
            <div className="brand-serif text-3xl font-bold">BharatMart</div>
          </div>
          <p className="mt-4 text-sm text-background/70 max-w-sm leading-relaxed">
            A modern shopping experience built for the Indian consumer. Curated brands, fair prices,
            fast delivery — all in ₹.
          </p>
          <p className="mt-6 overline text-background/60">Sign up for launch offers</p>
          <form className="mt-3 flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
            <input
              className="flex-1 bg-background/10 border border-background/20 rounded-full px-4 py-2 text-sm placeholder:text-background/40 focus:outline-none focus:border-accent"
              placeholder="you@email.com"
              type="email"
            />
            <button className="rounded-full bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold hover:bg-[hsl(38,92%,45%)] transition-colors">
              Subscribe
            </button>
          </form>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <div className="overline text-background/60">{col.title}</div>
            <ul className="mt-4 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-background/80 hover:text-accent transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-background/60">
          <span>© {new Date().getFullYear()} BharatMart Retail Pvt. Ltd. All prices inclusive of GST.</span>
          <span className="tracking-wider">Delivered with ♥ across India</span>
        </div>
      </div>
    </footer>
  );
}
