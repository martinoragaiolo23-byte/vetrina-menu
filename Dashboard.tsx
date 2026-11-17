import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreditCard, ExternalLink, LayoutDashboard, Loader2, LogOut, QrCode, Store, UtensilsCrossed } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Overview } from "@/components/dashboard/Overview";
import { VenueForm } from "@/components/dashboard/VenueForm";
import { MenuEditor } from "@/components/dashboard/MenuEditor";
import { QrStudio } from "@/components/dashboard/QrStudio";
import { SubscriptionPanel, CheckoutDialog } from "@/components/dashboard/SubscriptionPanel";
import { apiPut } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { endSession } from "@/lib/session";
import { VENUE_KEY, useMe, useVenue } from "@/lib/auth";
import { errorMessage, type Venue, type VenueIn } from "@/lib/types";
import { cn } from "@/lib/utils";

export type Tab = "overview" | "info" | "menu" | "qr" | "plan";

const NAV: { id: Tab; label: string; icon: typeof Store; testId: string }[] = [
  { id: "overview", label: "Panoramica", icon: LayoutDashboard, testId: "dashboard-nav-overview" },
  { id: "info", label: "Dati locale", icon: Store, testId: "dashboard-nav-info" },
  { id: "menu", label: "Listino & Menù", icon: UtensilsCrossed, testId: "dashboard-nav-menu" },
  { id: "qr", label: "QR Code", icon: QrCode, testId: "dashboard-nav-qr" },
  { id: "plan", label: "Abbonamento", icon: CreditCard, testId: "dashboard-nav-subscription" },
];

const TITLES: Record<Tab, string> = {
  overview: "Panoramica",
  info: "Dati del locale",
  menu: "Listino & Menù",
  qr: "QR Code per i tavoli",
  plan: "Abbonamento",
};

function toInput(v: Venue): VenueIn {
  const { slug, name, category, city, address, phone, whatsapp, description, hours, logo, cover, menu } = v;
  return { slug, name, category, city, address, phone, whatsapp, description, hours, logo, cover, menu };
}

export default function Dashboard() {
  const me = useMe();
  const venueQ = useVenue(!!me.data && !me.isError);
  const [params, setParams] = useSearchParams();
  const tab = (NAV.some((n) => n.id === params.get("tab")) ? params.get("tab") : "overview") as Tab;
  const goTo = (t: Tab) => setParams({ tab: t });
  const [draft, setDraft] = useState<VenueIn | null>(null);
  const [checkout, setCheckout] = useState(false);

  const save = useMutation({
    mutationFn: (body: VenueIn) => apiPut<Venue>("/venue", body),
    onSuccess: (v) => {
      queryClient.setQueryData(VENUE_KEY, v);
      setDraft(null);
      toast.success("Modifiche salvate");
    },
    onError: (err) => toast.error(errorMessage(err, "Salvataggio non riuscito")),
  });

  if (me.isError) return <Navigate to="/accedi" replace />;
  if (!me.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linen" data-testid="dashboard-loading">
        <Loader2 className="size-6 animate-spin text-terracotta" />
      </div>
    );
  }

  const user = me.data;
  const sub = user.subscription;
  const venue = venueQ.data;
  const current = draft ?? (venue ? toInput(venue) : null);
  const patch = (p: Partial<VenueIn>) => current && setDraft({ ...current, ...p });

  return (
    <div className="min-h-screen bg-linen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-stone-900 p-5 text-linen lg:flex" data-testid="dashboard-sidebar">
        <Logo dark to="/dashboard" />
        <nav className="mt-10 space-y-1">
          {NAV.map(({ id, label, icon: Icon, testId }) => (
            <button
              key={id}
              type="button"
              onClick={() => goTo(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                tab === id ? "bg-orange-600 font-semibold text-white" : "text-stone-300 hover:bg-stone-800 hover:text-white",
              )}
              data-testid={testId}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </nav>
        {venue && (
          <a href={`/locale/${venue.slug}`} target="_blank" rel="noreferrer" className="mt-6 flex items-center gap-2 rounded-xl border border-stone-700 px-3 py-2.5 text-sm text-orange-200 transition-colors hover:bg-stone-800" data-testid="dashboard-view-public-link">
            <ExternalLink className="size-4" /> Vedi pagina pubblica
          </a>
        )}
        <div className="mt-auto border-t border-stone-800 pt-4">
          <p className="truncate text-sm font-medium" data-testid="dashboard-user-name">{user.name}</p>
          <p className="truncate text-xs text-stone-400" data-testid="dashboard-user-email">{user.email}</p>
          <button type="button" onClick={() => endSession("/accedi")} className="mt-3 flex items-center gap-2 text-sm text-stone-400 transition-colors hover:text-white" data-testid="logout-button">
            <LogOut className="size-4" /> Esci
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-linen/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-5 py-3 lg:hidden">
            <Logo to="/dashboard" />
            <button type="button" onClick={() => endSession("/accedi")} className="text-stone-500" aria-label="Esci" data-testid="logout-button-mobile">
              <LogOut className="size-5" />
            </button>
          </div>
          <nav className="no-scrollbar flex gap-1 overflow-x-auto px-4 pb-3 lg:hidden">
            {NAV.map(({ id, label, testId }) => (
              <button
                key={id}
                type="button"
                onClick={() => goTo(id)}
                className={cn("whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-colors", tab === id ? "bg-stone-900 text-white" : "bg-white text-stone-600")}
                data-testid={`${testId}-mobile`}
              >
                {label}
              </button>
            ))}
          </nav>
          {sub.plan !== "pro" && (
            <div className={cn("flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 text-sm lg:px-10", sub.plan === "expired" ? "bg-red-700 text-white" : "bg-orange-100 text-orange-950")} data-testid="trial-banner">
              <span>
                {sub.plan === "expired"
                  ? "La prova gratuita è terminata: la tua pagina pubblica è in pausa."
                  : `Prova gratuita: ti rimangono ${sub.days_left} ${sub.days_left === 1 ? "giorno" : "giorni"}.`}
              </span>
              <Button size="sm" variant={sub.plan === "expired" ? "secondary" : "default"} onClick={() => setCheckout(true)} data-testid="trial-banner-upgrade-button">
                Attiva Piano Pro · 29 €/mese
              </Button>
            </div>
          )}
        </header>

        <main className="mx-auto max-w-5xl px-5 py-8 lg:px-10">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl font-semibold tracking-tight" data-testid="dashboard-title">{TITLES[tab]}</h1>
            {draft && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900" data-testid="unsaved-badge">Modifiche non salvate</span>}
          </div>

          {!current || !venue ? (
            <div className="flex justify-center py-20" data-testid="venue-loading">
              {venueQ.isError ? <p className="text-stone-500">Impossibile caricare i dati del locale.</p> : <Loader2 className="size-6 animate-spin text-terracotta" />}
            </div>
          ) : (
            <>
              {tab === "overview" && <Overview user={user} venue={venue} goTo={goTo} />}
              {tab === "info" && <VenueForm venue={current} onChange={patch} onSave={() => save.mutate(current)} saving={save.isPending} dirty={!!draft} />}
              {tab === "menu" && (
                <MenuEditor
                  menu={current.menu}
                  onChange={(menu) => patch({ menu })}
                  onSave={() => save.mutate(current)}
                  saving={save.isPending}
                  dirty={!!draft}
                  serviceMode={current.category === "parrucchiere"}
                />
              )}
              {tab === "qr" && <QrStudio slug={venue.slug} name={venue.name} isActive={sub.is_active} />}
              {tab === "plan" && <SubscriptionPanel user={user} />}
            </>
          )}
          <p className="mt-12 text-center text-xs text-stone-400">
            <Link to="/" className="hover:underline" data-testid="dashboard-home-link">MenuSito</Link> · Pagamenti in modalità simulata
          </p>
        </main>
      </div>
      <CheckoutDialog open={checkout} onOpenChange={setCheckout} />
    </div>
  );
}
