import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { formatINR } from "@/lib/format";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data));
  }, [id]);

  if (!order) return <div className="min-h-[50vh] grid place-items-center text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-14 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-[hsl(160,60%,90%)] grid place-items-center">
        <CheckCircle2 className="h-10 w-10 text-[hsl(160,60%,35%)]" strokeWidth={1.5} />
      </div>
      <h1 className="brand-serif text-4xl font-semibold mt-6 tracking-tight" data-testid="order-success-title">
        Order confirmed!
      </h1>
      <p className="mt-3 text-muted-foreground">
        Thank you for shopping with BharatMart. Your order <span className="font-mono">#{order.id.slice(0, 8).toUpperCase()}</span> has been placed.
      </p>

      <div className="mt-8 text-left border border-border bg-white rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border">
          <div className="overline text-muted-foreground">Shipping to</div>
          <div className="mt-1 text-sm">
            <div className="font-semibold">{order.address.full_name}</div>
            <div>{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}</div>
            <div>{order.address.city}, {order.address.state} — {order.address.pincode}</div>
            <div>{order.address.phone}</div>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {order.items.map((it) => (
            <div key={it.product_id} className="flex gap-3 items-center">
              <div className="w-14 h-14 rounded-md bg-secondary overflow-hidden shrink-0">
                <img src={it.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium line-clamp-1">{it.name}</div>
                <div className="text-xs text-muted-foreground">Qty {it.quantity}</div>
              </div>
              <div className="text-sm font-semibold">{formatINR(it.line_total)}</div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 bg-secondary/50 border-t border-border flex justify-between text-sm">
          <span className="font-semibold">Total paid</span>
          <span className="font-bold">{formatINR(order.total)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/orders" className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold">
          View my orders
        </Link>
        <Link to="/products" className="rounded-full border border-foreground px-6 py-3 text-sm font-semibold hover:bg-foreground hover:text-background transition-colors">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
