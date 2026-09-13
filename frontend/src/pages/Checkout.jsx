import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { api, formatApiError } from "@/lib/api";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { Lock, CreditCard, Truck } from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
];

export default function Checkout() {
  const { cart, refresh } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [payment, setPayment] = useState("COD");
  const [form, setForm] = useState({
    full_name: "", phone: "", line1: "", line2: "", city: "", state: "Maharashtra", pincode: "",
  });

  const handle = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (cart.items.length === 0) { toast.error("Cart is empty"); return; }
    if (!/^\d{10}$/.test(form.phone)) { toast.error("Enter a 10-digit phone number"); return; }
    if (!/^\d{6}$/.test(form.pincode)) { toast.error("Enter a 6-digit PIN code"); return; }
    setPlacing(true);
    try {
      const { data } = await api.post("/orders", { address: form, payment_method: payment });
      await refresh();
      toast.success("Order placed successfully!");
      navigate(`/order-success/${data.id}`);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setPlacing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="brand-serif text-3xl mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground">Add items before proceeding to checkout.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
      <h1 className="brand-serif text-4xl font-semibold tracking-tight mb-8">Checkout</h1>

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-8">
          <section className="border border-border bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck size={16} className="text-primary" />
              <div className="brand-serif text-xl font-semibold">Shipping address</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full name" required value={form.full_name} onChange={handle("full_name")} testid="ck-name" />
              <Field label="Phone (10 digits)" required value={form.phone} onChange={handle("phone")} testid="ck-phone" inputMode="numeric" maxLength={10} />
              <Field label="Address line 1" required className="sm:col-span-2" value={form.line1} onChange={handle("line1")} testid="ck-line1" />
              <Field label="Address line 2 (optional)" className="sm:col-span-2" value={form.line2} onChange={handle("line2")} testid="ck-line2" />
              <Field label="City" required value={form.city} onChange={handle("city")} testid="ck-city" />
              <div>
                <label className="overline block mb-1">State *</label>
                <select
                  value={form.state}
                  onChange={handle("state")}
                  required
                  data-testid="ck-state"
                  className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-primary"
                >
                  {INDIAN_STATES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <Field label="PIN code" required value={form.pincode} onChange={handle("pincode")} testid="ck-pincode" inputMode="numeric" maxLength={6} />
            </div>
          </section>

          <section className="border border-border bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={16} className="text-primary" />
              <div className="brand-serif text-xl font-semibold">Payment method</div>
              <span className="ml-auto text-xs text-muted-foreground">Mock — no real charge</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "COD", label: "Cash on Delivery", sub: "Pay at your doorstep" },
                { id: "UPI", label: "UPI", sub: "GPay / PhonePe / Paytm" },
                { id: "CARD", label: "Credit / Debit card", sub: "Visa · Mastercard · RuPay" },
              ].map((p) => (
                <label
                  key={p.id}
                  data-testid={`payment-${p.id.toLowerCase()}`}
                  onClick={() => setPayment(p.id)}
                  className={`cursor-pointer border rounded-xl p-4 transition-colors ${
                    payment === p.id ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={p.id}
                    checked={payment === p.id}
                    onChange={() => setPayment(p.id)}
                    className="sr-only"
                  />
                  <div className="text-sm font-semibold">{p.label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.sub}</div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="border border-border bg-white rounded-2xl p-6">
            <div className="overline mb-4">Order summary</div>
            <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.items.map((it) => (
                <li key={it.product.id} className="flex gap-3 text-sm">
                  <div className="w-12 h-12 rounded-md bg-secondary overflow-hidden shrink-0">
                    <img src={it.product.images[0]} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="line-clamp-1">{it.product.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {it.quantity}</div>
                  </div>
                  <div className="font-semibold whitespace-nowrap">{formatINR(it.line_total)}</div>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(cart.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{cart.shipping === 0 ? "FREE" : formatINR(cart.shipping)}</dd></div>
              <div className="pt-2 border-t border-border flex justify-between items-baseline">
                <dt className="text-sm font-semibold">Total</dt>
                <dd className="text-2xl font-bold" data-testid="checkout-total">{formatINR(cart.total)}</dd>
              </div>
            </dl>
            <button
              type="submit"
              disabled={placing}
              data-testid="place-order-btn"
              className="mt-5 w-full rounded-full bg-accent text-accent-foreground py-3 text-sm font-bold hover:bg-[hsl(38,92%,45%)] transition-colors disabled:opacity-60"
            >
              {placing ? "Placing order…" : `Place order · ${formatINR(cart.total)}`}
            </button>
            <div className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Lock size={12} /> Secure mock checkout · No real payment
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, required, className = "", testid, ...rest }) {
  return (
    <div className={className}>
      <label className="overline block mb-1">{label}{required && " *"}</label>
      <input
        {...rest}
        required={required}
        data-testid={testid}
        className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white outline-none focus:border-primary"
      />
    </div>
  );
}
