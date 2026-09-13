import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setSubmitting(true);
    const res = await register(form.name, form.email, form.password);
    setSubmitting(false);
    if (res.ok) {
      toast.success(`Welcome to BharatMart, ${form.name.split(" ")[0]}!`);
      navigate("/", { replace: true });
    } else {
      setError(res.error || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="border border-border bg-white rounded-2xl p-8">
        <h1 className="brand-serif text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground mt-1">Join thousands of Indian shoppers.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="overline block mb-1">Full name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-testid="register-name"
              className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="overline block mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              data-testid="register-email"
              className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="overline block mb-1">Password (min 6)</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              data-testid="register-password"
              className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {error && <div className="text-sm text-destructive" data-testid="register-error">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            data-testid="register-submit"
            className="w-full rounded-full bg-primary text-primary-foreground py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
