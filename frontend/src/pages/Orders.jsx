import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";
import { Package } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    api.get("/orders").then((r) => setOrders(r.data.orders));
  }, []);

  if (orders === null) return <div className="min-h-[50vh] grid place-items-center text-muted-foreground">Loading…</div>;

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Package className="mx-auto h-14 w-14 text-muted-foreground" strokeWidth={1.25} />
        <h1 className="brand-serif text-4xl font-semibold mt-6">No orders yet</h1>
        <p className="mt-2 text-muted-foreground">Your future orders will appear here.</p>
        <Link to="/products" className="inline-block mt-8 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
      <h1 className="brand-serif text-4xl font-semibold tracking-tight mb-8">Your orders</h1>
      <div className="space-y-6">
        {orders.map((o) => (
          <div key={o.id} className="border border-border bg-white rounded-2xl overflow-hidden" data-testid={`order-${o.id}`}>
            <div className="flex flex-wrap gap-4 items-center justify-between px-5 py-4 bg-secondary/50 border-b border-border text-xs">
              <div>
                <div className="overline text-muted-foreground">Order</div>
                <div className="font-mono">#{o.id.slice(0, 8).toUpperCase()}</div>
              </div>
              <div>
                <div className="overline text-muted-foreground">Placed</div>
                <div>{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
              <div>
                <div className="overline text-muted-foreground">Total</div>
                <div className="font-semibold text-sm">{formatINR(o.total)}</div>
              </div>
              <div>
                <div className="overline text-muted-foreground">Status</div>
                <span className="inline-block bg-[hsl(160,60%,35%)] text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {o.status}
                </span>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {o.items.map((it) => (
                <div key={it.product_id} className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-md bg-secondary overflow-hidden shrink-0">
                    <img src={it.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${it.product_id}`} className="text-sm font-medium hover:text-primary line-clamp-1">
                      {it.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">Qty {it.quantity} · {formatINR(it.price)} each</div>
                  </div>
                  <div className="text-sm font-semibold whitespace-nowrap">{formatINR(it.line_total)}</div>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5 text-xs text-muted-foreground">
              Delivering to {o.address.full_name}, {o.address.line1}, {o.address.city}, {o.address.state} — {o.address.pincode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
