import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import { queryClient } from "@/lib/queryClient";
import { ME_KEY, useMe } from "@/lib/auth";
import { errorMessage, type User } from "@/lib/types";

const PERKS = ["7 giorni gratis, nessuna carta richiesta", "Pagina pubblica ottimizzata per smartphone", "QR Code in alta risoluzione per i tavoli"];

export default function Register() {
  const navigate = useNavigate();
  const me = useMe();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = useMutation({
    mutationFn: () => apiPost<User>("/auth/register", { name, email, password }),
    onSuccess: (user) => {
      beginSession();
      queryClient.setQueryData(ME_KEY, user);
      toast.success("Account creato! La tua prova gratuita di 7 giorni è iniziata.");
      navigate("/dashboard?tab=info");
    },
    onError: (err) => toast.error(errorMessage(err, "Registrazione non riuscita")),
  });

  if (me.data && !me.isError && !register.isSuccess) return <Navigate to="/dashboard" replace />;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("La password deve avere almeno 6 caratteri");
      return;
    }
    register.mutate();
  };

  return (
    <AuthLayout
      title="Crea il tuo MenuSito"
      subtitle="Due minuti e il tuo locale è online, con menù e QR Code."
      side={
        <>
          <span className="inline-block rounded-full bg-orange-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Prova gratuita 7 giorni</span>
          <h2 className="mt-5 text-4xl font-semibold leading-tight">Il tuo locale, online prima che il caffè si raffreddi.</h2>
          <ul className="mt-6 space-y-3 text-stone-200">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-3">
                <Check className="size-4 text-orange-300" /> {p}
              </li>
            ))}
          </ul>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" data-testid="register-form">
        <div className="space-y-1.5">
          <Label htmlFor="name">Il tuo nome</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="h-11 bg-white" data-testid="register-name-input" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 bg-white" data-testid="register-email-input" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required autoComplete="new-password" placeholder="Almeno 6 caratteri" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 bg-white" data-testid="register-password-input" />
        </div>
        <Button type="submit" size="lg" className="h-11 w-full" disabled={register.isPending} data-testid="register-submit-button">
          {register.isPending ? "Creazione…" : "Inizia la prova gratuita"}
        </Button>
      </form>
      <p className="mt-6 text-sm text-stone-600">
        Hai già un account?{" "}
        <Link to="/accedi" className="font-medium text-terracotta hover:underline" data-testid="register-login-link">
          Accedi
        </Link>
      </p>
    </AuthLayout>
  );
}
