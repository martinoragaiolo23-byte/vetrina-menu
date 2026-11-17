import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, CreditCard, Crown, FlaskConical, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiPost } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { ME_KEY } from "@/lib/auth";
import type { User } from "@/lib/types";

const fmtDate = (s: string) => new Date(s).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });

export function useSubscriptionAction(path: string, success: string) {
  return useMutation({
    mutationFn: () => apiPost<User>(path),
    onSuccess: (u) => {
      queryClient.setQueryData(ME_KEY, u);
      toast.success(success);
    },
    onError: () => toast.error("Operazione non riuscita"),
  });
}

export function CheckoutDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const activate = useSubscriptionAction("/subscription/activate", "Piano Pro attivato! La tua pagina è online.");
  const [card, setCard] = useState("4242 4242 4242 4242");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="checkout-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Attiva il Piano Pro</DialogTitle>
          <DialogDescription>29 € al mese, disdici quando vuoi.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900" data-testid="checkout-simulated-notice">
          <FlaskConical className="size-4" /> Pagamento simulato: nessun addebito reale verrà effettuato.
        </div>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="card">Numero carta</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
              <Input id="card" value={card} onChange={(e) => setCard(e.target.value)} className="pl-9 font-mono" data-testid="checkout-card-input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input defaultValue="12/29" aria-label="Scadenza" data-testid="checkout-expiry-input" />
            <Input defaultValue="123" aria-label="CVC" data-testid="checkout-cvc-input" />
          </div>
        </div>
        <DialogFooter>
          <Button
            size="lg"
            className="h-11 w-full gap-2"
            disabled={activate.isPending}
            onClick={() => activate.mutate(undefined, { onSuccess: () => onOpenChange(false) })}
            data-testid="simulated-payment-submit"
          >
            <Lock className="size-4" /> {activate.isPending ? "Elaborazione…" : "Paga 29 € e attiva"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SubscriptionPanel({ user }: { user: User }) {
  const sub = user.subscription;
  const [open, setOpen] = useState(false);
  const cancel = useSubscriptionAction("/subscription/cancel", "Abbonamento disdetto");
  const expire = useSubscriptionAction("/subscription/simulate-expiry", "Prova terminata (simulazione)");

  return (
    <div className="grid gap-6 animate-rise lg:grid-cols-[1.2fr_1fr]" data-testid="subscription-panel">
      <section className="rounded-3xl border border-stone-200 bg-white p-7">
        <p className="text-sm font-medium uppercase tracking-wider text-stone-500">Stato attuale</p>
        {sub.plan === "pro" && (
          <div data-testid="subscription-status-pro">
            <h3 className="mt-2 flex items-center gap-2 text-3xl font-semibold"><Crown className="size-7 text-amber-600" /> Piano Pro attivo</h3>
            <p className="mt-2 text-stone-600">Attivo dal {sub.pro_since ? fmtDate(sub.pro_since) : "oggi"}. Prossimo rinnovo simulato: 29 €/mese.</p>
          </div>
        )}
        {sub.plan === "trial" && (
          <div data-testid="subscription-status-trial">
            <h3 className="mt-2 text-3xl font-semibold">
              Prova gratuita: <span className="text-terracotta">{sub.days_left} {sub.days_left === 1 ? "giorno" : "giorni"}</span> rimasti
            </h3>
            <p className="mt-2 text-stone-600">La prova termina il {fmtDate(sub.trial_ends_at)}. Dopo, la tua pagina pubblica verrà messa in pausa.</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-stone-100">
              <div className="h-full rounded-full bg-orange-500 transition-[width] duration-500" style={{ width: `${Math.min(100, (sub.days_left / 7) * 100)}%` }} />
            </div>
          </div>
        )}
        {sub.plan === "expired" && (
          <div data-testid="subscription-status-expired">
            <h3 className="mt-2 text-3xl font-semibold text-red-800">Prova terminata</h3>
            <p className="mt-2 text-stone-600">La tua pagina pubblica è in pausa. Attiva il Piano Pro per tornare online subito.</p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {sub.plan !== "pro" ? (
            <Button size="lg" className="h-11 gap-2 px-6" onClick={() => setOpen(true)} data-testid="subscription-upgrade-button">
              <Crown className="size-4" /> Attiva Piano Pro · 29 €/mese
            </Button>
          ) : (
            <Button variant="outline" onClick={() => window.confirm("Vuoi davvero disdire il Piano Pro?") && cancel.mutate()} disabled={cancel.isPending} data-testid="subscription-cancel-button">
              Disdici abbonamento
            </Button>
          )}
        </div>
      </section>

      <section className="rounded-3xl bg-stone-900 p-7 text-linen">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-300">Piano Pro</p>
        <p className="mt-2 font-heading text-4xl font-semibold">29 €<span className="font-sans text-base font-normal text-stone-400"> /mese</span></p>
        <ul className="mt-5 space-y-2 text-sm text-stone-300">
          {["Pagina pubblica sempre online", "Menù e foto illimitati", "QR Code in alta risoluzione", "Pulsanti Chiama, WhatsApp, Maps"].map((f) => (
            <li key={f} className="flex items-center gap-2"><Check className="size-4 text-orange-400" /> {f}</li>
          ))}
        </ul>
        <div className="mt-8 border-t border-stone-700 pt-5">
          <p className="text-xs text-stone-400">Strumento demo: termina subito la prova per vedere come appare la pagina bloccata.</p>
          <Button variant="outline" size="sm" className="mt-3 border-stone-600 bg-transparent text-linen hover:bg-stone-800 hover:text-white" onClick={() => expire.mutate()} disabled={expire.isPending} data-testid="subscription-simulate-expiry-button">
            <FlaskConical className="size-4" /> Simula scadenza prova
          </Button>
        </div>
      </section>
      <CheckoutDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
