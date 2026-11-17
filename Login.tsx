import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import { queryClient } from "@/lib/queryClient";
import { ME_KEY, useMe } from "@/lib/auth";
import { errorMessage, type User } from "@/lib/types";

export default function Login() {
  const navigate = useNavigate();
  const me = useMe();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useMutation({
    mutationFn: () => apiPost<User>("/auth/login", { email, password }),
    onSuccess: (user) => {
      beginSession();
      queryClient.setQueryData(ME_KEY, user);
      navigate("/dashboard");
    },
    onError: (err) => toast.error(errorMessage(err, "Accesso non riuscito")),
  });

  if (me.data && !me.isError && !login.isSuccess) return <Navigate to="/dashboard" replace />;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate();
  };

  return (
    <AuthLayout
      title="Bentornato"
      subtitle="Accedi per gestire il tuo locale, il menù e il QR Code."
      side={
        <>
          <p className="font-heading text-3xl leading-snug">
            “Abbiamo tolto i menù di carta: ora i clienti inquadrano il QR e prenotano su WhatsApp.”
          </p>
          <p className="mt-4 text-sm text-stone-300">Mario R. — Trattoria Da Mario, Roma</p>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" data-testid="login-form">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-white" data-testid="login-email-input" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-white" data-testid="login-password-input" />
        </div>
        <Button type="submit" size="lg" className="h-11 w-full" disabled={login.isPending} data-testid="login-submit-button">
          {login.isPending ? "Accesso…" : "Accedi"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-stone-600">
        Non hai un account?{" "}
        <Link to="/registrati" className="font-medium text-terracotta hover:underline" data-testid="login-register-link">
          Prova gratis 7 giorni
        </Link>
      </p>
    </AuthLayout>
  );
}
