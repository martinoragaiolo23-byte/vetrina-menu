import { ArrowRight, CheckCircle2, Circle, ExternalLink } from "lucide-react";
import type { User, Venue } from "@/lib/types";
import { publicUrl } from "@/lib/types";
import type { Tab } from "@/pages/Dashboard";

export function Overview({ user, venue, goTo }: { user: User; venue: Venue; goTo: (t: Tab) => void }) {
  const itemCount = venue.menu.reduce((n, c) => n + c.items.length, 0);
  const checks: { label: string; done: boolean; tab: Tab }[] = [
    { label: "Nome, categoria e città", done: !!venue.name && !!venue.city, tab: "info" },
    { label: "Telefono e WhatsApp", done: !!venue.phone && !!venue.whatsapp, tab: "info" },
    { label: "Foto di copertina", done: !!venue.cover, tab: "info" },
    { label: "Almeno 3 voci nel listino", done: itemCount >= 3, tab: "menu" },
    { label: "Scarica il QR Code", done: false, tab: "qr" },
  ];
  const done = checks.filter((c) => c.done).length;

  return (
    <div className="grid gap-6 animate-rise lg:grid-cols-[1.3fr_1fr]" data-testid="overview-panel">
      <section className="rounded-3xl border border-stone-200 bg-white p-7">
        <h3 className="text-2xl font-semibold">Ciao {user.name.split(" ")[0]}, completa il tuo locale</h3>
        <p className="mt-1 text-stone-600">{done} di {checks.length} passaggi completati</p>
        <ul className="mt-6 space-y-1">
          {checks.map((c, i) => (
            <li key={c.label}>
              <button type="button" onClick={() => goTo(c.tab)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-stone-50" data-testid={`overview-check-${i}`}>
                {c.done ? <CheckCircle2 className="size-5 text-olive" /> : <Circle className="size-5 text-stone-300" />}
                <span className={c.done ? "text-stone-500 line-through" : "font-medium"}>{c.label}</span>
                <ArrowRight className="ml-auto size-4 text-stone-400 transition-transform group-hover:translate-x-1" />
              </button>
            </li>
          ))}
        </ul>
      </section>
      <section className="space-y-4">
        <div className="rounded-3xl bg-orange-100 p-6">
          <p className="text-sm font-medium text-orange-900">La tua pagina pubblica</p>
          <p className="mt-2 break-all font-mono text-sm text-orange-950" data-testid="overview-public-url">{publicUrl(venue.slug).replace(/^https?:\/\//, "")}</p>
          <a href={`/locale/${venue.slug}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-900 hover:underline" data-testid="overview-open-public-link">
            Apri la pagina <ExternalLink className="size-4" />
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Categorie</p>
            <p className="mt-1 font-heading text-3xl font-semibold" data-testid="overview-category-count">{venue.menu.length}</p>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Voci nel listino</p>
            <p className="mt-1 font-heading text-3xl font-semibold" data-testid="overview-item-count">{itemCount}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
