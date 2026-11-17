import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Clock, Loader2, Lock, MapPin, MessageCircle, Phone } from "lucide-react";
import { apiGet, ApiError } from "@/lib/api";
import { CATEGORY_LABELS, formatPrice, mapsLink, whatsappLink, type PublicVenueOut, type Venue } from "@/lib/types";
import { LogoMark } from "@/components/Logo";
import { cn } from "@/lib/utils";

const DAY_ORDER = [6, 0, 1, 2, 3, 4, 5]; // JS getDay() → index in Lunedì..Domenica

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-linen px-6 text-center">{children}</div>;
}

function PoweredBy() {
  return (
    <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600" data-testid="public-powered-by-link">
      <LogoMark className="size-4" /> Creato con MenuSito
    </Link>
  );
}

function ActionButtons({ v, className }: { v: Venue; className?: string }) {
  const base = "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl text-xs font-semibold transition-transform active:scale-95 sm:flex-row sm:gap-2 sm:text-sm";
  return (
    <div className={cn("flex gap-2", className)}>
      {v.phone && (
        <a href={`tel:${v.phone.replace(/\s/g, "")}`} className={cn(base, "bg-stone-900 text-white")} data-testid="public-page-call-button">
          <Phone className="size-5 sm:size-4" /> Chiama ora
        </a>
      )}
      {v.whatsapp && (
        <a href={whatsappLink(v.whatsapp, v.name)} target="_blank" rel="noreferrer" className={cn(base, "bg-[#128C4A] text-white")} data-testid="public-page-whatsapp-button">
          <MessageCircle className="size-5 sm:size-4" /> <span className="sm:hidden">Prenota</span><span className="hidden sm:inline">Prenota su WhatsApp</span>
        </a>
      )}
      <a href={mapsLink(v)} target="_blank" rel="noreferrer" className={cn(base, "border border-stone-200 bg-white text-stone-800")} data-testid="public-page-maps-button">
        <MapPin className="size-5 sm:size-4" /> Apri su Maps
      </a>
    </div>
  );
}

function VenuePage({ v }: { v: Venue }) {
  const todayIdx = DAY_ORDER[new Date().getDay()];
  const today = v.hours[todayIdx];
  const cats = v.menu.filter((c) => c.items.length > 0);

  return (
    <div className="min-h-screen bg-linen pb-28" data-testid="public-venue-page">
      <div className="relative h-60 bg-stone-800 sm:h-72">
        {v.cover && <img src={v.cover} alt={`Copertina ${v.name}`} className="h-full w-full object-cover" data-testid="public-cover-image" />}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,25,23,0.2)_0%,rgba(28,25,23,0.85)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-2xl items-end gap-4 px-5 pb-5 text-white">
          {v.logo && <img src={v.logo} alt="Logo" className="size-16 shrink-0 rounded-2xl border-2 border-white/80 bg-white object-cover shadow-lg" data-testid="public-logo-image" />}
          <div className="min-w-0 animate-rise">
            <p className="text-xs font-medium uppercase tracking-wider text-orange-200" data-testid="public-venue-category">
              {CATEGORY_LABELS[v.category]}{v.city ? ` · ${v.city}` : ""}
            </p>
            <h1 className="mt-1 text-3xl font-semibold leading-tight sm:text-4xl" data-testid="public-venue-name">{v.name || "Il nostro locale"}</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5">
        <ActionButtons v={v} className="-mt-0 hidden pt-5 sm:flex" />

        {today && (
          <p className="mt-5 flex items-center gap-2 text-sm text-stone-700" data-testid="public-today-hours">
            <Clock className="size-4 text-terracotta" />
            <span className="font-semibold">Oggi:</span> {today.hours || "Chiuso"}
          </p>
        )}
        {v.description && <p className="mt-4 leading-relaxed text-stone-700" data-testid="public-venue-description">{v.description}</p>}
        {v.address && (
          <p className="mt-3 flex items-start gap-2 text-sm text-stone-500" data-testid="public-venue-address">
            <MapPin className="mt-0.5 size-4 shrink-0" /> {v.address}{v.city && !v.address.includes(v.city) ? `, ${v.city}` : ""}
          </p>
        )}
      </div>

      {cats.length > 0 && (
        <nav className="no-scrollbar sticky top-0 z-20 mt-6 flex gap-2 overflow-x-auto border-b border-stone-200 bg-linen/90 px-5 py-3 backdrop-blur-xl sm:justify-center" data-testid="public-category-nav">
          {cats.map((c) => (
            <a key={c.id} href={`#cat-${c.id}`} className="min-h-10 whitespace-nowrap rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-900 hover:text-white" data-testid={`public-category-chip-${c.id}`}>
              {c.name}
            </a>
          ))}
        </nav>
      )}

      <main className="mx-auto max-w-2xl space-y-10 px-5 pt-6">
        {cats.length === 0 && <p className="py-10 text-center text-stone-500" data-testid="public-menu-empty">Il listino sarà disponibile a breve.</p>}
        {cats.map((c) => (
          <section key={c.id} id={`cat-${c.id}`} className="scroll-mt-20" data-testid="public-menu-section">
            <h2 className="text-2xl font-semibold">{c.name}</h2>
            <div className="mt-4 space-y-3">
              {c.items.map((it) => (
                <article key={it.id} className={cn("flex gap-4 rounded-2xl bg-white p-4 shadow-[0_1px_3px_rgba(28,25,23,0.06)]", !it.available && "opacity-55")} data-testid="public-menu-item">
                  {it.image && <img src={it.image} alt={it.name} className="size-20 shrink-0 rounded-xl object-cover" loading="lazy" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-sans font-semibold text-stone-900">{it.name}</h3>
                      <span className="whitespace-nowrap font-bold text-terracotta" data-testid="public-menu-item-price">{formatPrice(it.price)}</span>
                    </div>
                    {it.description && <p className="mt-1 text-sm leading-snug text-stone-500">{it.description}</p>}
                    {!it.available && <span className="mt-2 inline-block rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">Esaurito</span>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {v.hours.length > 0 && (
          <section className="rounded-2xl bg-white p-5" data-testid="public-hours-section">
            <h2 className="text-xl font-semibold">Orari di apertura</h2>
            <dl className="mt-3 divide-y divide-stone-100 text-sm">
              {v.hours.map((h, i) => (
                <div key={h.day} className={cn("flex justify-between py-2", i === todayIdx && "font-semibold text-terracotta")}>
                  <dt>{h.day}</dt>
                  <dd>{h.hours || "Chiuso"}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
        <div className="py-6 text-center"><PoweredBy /></div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200/90 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:hidden" data-testid="public-sticky-actions">
        <ActionButtons v={v} />
      </div>
    </div>
  );
}

export default function PublicVenue() {
  const { slug = "" } = useParams();
  const q = useQuery({
    queryKey: ["public-venue", slug],
    queryFn: () => apiGet<PublicVenueOut>(`/public/venues/${encodeURIComponent(slug)}`),
    retry: false,
  });

  if (q.isPending) {
    return (
      <Shell>
        <Loader2 className="size-6 animate-spin text-terracotta" data-testid="public-loading" />
      </Shell>
    );
  }

  if (q.isError || !q.data) {
    const notFound = q.error instanceof ApiError && q.error.status === 404;
    return (
      <Shell>
        <LogoMark className="size-12" />
        <h1 className="text-3xl font-semibold" data-testid="public-not-found">{notFound ? "Locale non trovato" : "Pagina non disponibile"}</h1>
        <p className="max-w-sm text-stone-600">{notFound ? "Controlla l'indirizzo o inquadra di nuovo il QR Code." : "Riprova tra qualche istante."}</p>
        <PoweredBy />
      </Shell>
    );
  }

  if (q.data.status === "blocked" || !q.data.venue) {
    return (
      <Shell>
        <div className="flex size-16 items-center justify-center rounded-full bg-stone-900 text-orange-300">
          <Lock className="size-7" />
        </div>
        <h1 className="max-w-md text-3xl font-semibold" data-testid="public-blocked-title">{q.data.name ? `${q.data.name} è temporaneamente offline` : "Pagina temporaneamente offline"}</h1>
        <p className="max-w-md text-stone-600" data-testid="public-blocked-message">
          Il periodo di prova di questo locale è terminato. Se sei il proprietario, accedi alla dashboard e attiva il Piano Pro a 29 €/mese per riattivare subito la pagina per i tuoi clienti.
        </p>
        <Link to="/accedi" className="inline-flex h-11 items-center rounded-xl bg-terracotta px-6 font-semibold text-white transition-colors hover:bg-orange-800" data-testid="public-blocked-owner-login">
          Sono il proprietario: attiva il Piano Pro
        </Link>
        <PoweredBy />
      </Shell>
    );
  }

  return <VenuePage v={q.data.venue} />;
}
