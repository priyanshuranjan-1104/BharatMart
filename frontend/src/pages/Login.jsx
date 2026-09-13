import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (res.ok) {
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } else {
      setError(res.error || "Login failed");
    }
  };

  const useTest = () => {
    setEmail("test@bharatmart.in");
    setPassword("test123");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="border border-border bg-white rounded-2xl p-8">
        <h1 className="brand-serif text-3xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to continue shopping.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="overline block mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="login-email"
              className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="overline block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid="login-password"
              className="w-full border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          {error && <div className="text-sm text-destructive" data-testid="login-error">{error}</div>}

          <button
            type="submit"
            disabled={submitting}
            data-testid="login-submit"
            className="w-full rounded-full bg-primary text-primary-foreground py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border text-xs text-center">
          <button onClick={useTest} className="underline underline-offset-4 text-muted-foreground hover:text-foreground">
            Fill demo credentials
          </button>
        </div>
        <div className="mt-4 text-sm text-center">
          New to BharatMart?{" "}
          <Link to="/register" className="font-semibold text-primary underline underline-offset-4">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
