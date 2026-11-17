import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { CATEGORY_LABELS, slugify, type VenueCategory, type VenueIn } from "@/lib/types";

type Props = {
  venue: VenueIn;
  onChange: (patch: Partial<VenueIn>) => void;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
};

function Field({ id, label, children, hint }: { id: string; label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-stone-500">{hint}</p>}
    </div>
  );
}

export function VenueForm({ venue, onChange, onSave, saving, dirty }: Props) {
  const setName = (name: string) => {
    // auto-suggest the page address until the owner customises it
    const auto = venue.slug.startsWith("locale-") || venue.slug === slugify(venue.name);
    onChange(auto && slugify(name).length >= 2 ? { name, slug: slugify(name) } : { name });
  };

  return (
    <div className="space-y-6 animate-rise" data-testid="venue-form">
      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 className="text-lg font-semibold">Immagini</h3>
        <p className="text-sm text-stone-500">Foto di copertina e logo compaiono in cima alla tua pagina.</p>
        <div className="mt-5 flex flex-wrap items-end gap-5">
          <ImageUpload value={venue.cover} onChange={(cover) => onChange({ cover })} maxSize={1400} label="Carica copertina" testId="venue-cover-upload" className="h-36 w-full max-w-md" />
          <ImageUpload value={venue.logo} onChange={(logo) => onChange({ logo })} maxSize={400} label="Logo" testId="venue-logo-upload" className="size-24" round />
        </div>
      </section>

      <section className="grid gap-5 rounded-2xl border border-stone-200 bg-white p-6 md:grid-cols-2">
        <h3 className="text-lg font-semibold md:col-span-2">Dati del locale</h3>
        <Field id="v-name" label="Nome del locale">
          <Input id="v-name" value={venue.name} onChange={(e) => setName(e.target.value)} placeholder="Es. Trattoria Da Mario" data-testid="venue-name-input" />
        </Field>
        <Field id="v-cat" label="Categoria">
          <Select value={venue.category} onValueChange={(v: string) => onChange({ category: v as VenueCategory })}>
            <SelectTrigger id="v-cat" className="w-full" data-testid="venue-category-select">
              <SelectValue>{(v) => CATEGORY_LABELS[v as VenueCategory]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(CATEGORY_LABELS) as VenueCategory[]).map((c) => (
                <SelectItem key={c} value={c} data-testid={`venue-category-option-${c}`}>
                  {CATEGORY_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="v-city" label="Città">
          <Input id="v-city" value={venue.city} onChange={(e) => onChange({ city: e.target.value })} placeholder="Es. Roma" data-testid="venue-city-input" />
        </Field>
        <Field id="v-address" label="Indirizzo" hint="Usato per il pulsante “Apri su Google Maps”.">
          <Input id="v-address" value={venue.address} onChange={(e) => onChange({ address: e.target.value })} placeholder="Via Roma 1" data-testid="venue-address-input" />
        </Field>
        <Field id="v-phone" label="Telefono">
          <Input id="v-phone" type="tel" value={venue.phone} onChange={(e) => onChange({ phone: e.target.value })} placeholder="+39 06 1234567" data-testid="venue-phone-input" />
        </Field>
        <Field id="v-wa" label="Numero WhatsApp" hint="Per le prenotazioni. Includi il prefisso, es. +39 333 1234567.">
          <Input id="v-wa" type="tel" value={venue.whatsapp} onChange={(e) => onChange({ whatsapp: e.target.value })} placeholder="+39 333 1234567" data-testid="venue-whatsapp-input" />
        </Field>
        <div className="md:col-span-2">
          <Field id="v-desc" label="Descrizione">
            <Textarea id="v-desc" rows={4} value={venue.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Racconta in poche righe il tuo locale…" data-testid="venue-description-input" />
          </Field>
        </div>
        <div className="md:col-span-2">
          <Field id="v-slug" label="Indirizzo della pagina pubblica">
            <div className="flex items-center overflow-hidden rounded-lg border border-input bg-stone-50 focus-within:ring-2 focus-within:ring-ring/40">
              <span className="whitespace-nowrap pl-3 text-sm text-stone-500">{window.location.host}/locale/</span>
              <input id="v-slug" value={venue.slug} onChange={(e) => onChange({ slug: slugify(e.target.value) || e.target.value.toLowerCase() })} className="h-9 w-full bg-transparent px-1 font-mono text-sm outline-none" data-testid="venue-slug-input" />
            </div>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 className="text-lg font-semibold">Orari di apertura</h3>
        <p className="text-sm text-stone-500">Lascia vuoto per “Chiuso”. Es. 12:00-15:00, 19:00-23:00</p>
        <div className="mt-4 divide-y divide-stone-100">
          {venue.hours.map((h, i) => (
            <div key={h.day} className="grid grid-cols-[110px_1fr] items-center gap-3 py-2">
              <Label htmlFor={`h-${i}`} className="text-stone-700">{h.day}</Label>
              <Input
                id={`h-${i}`}
                value={h.hours}
                placeholder="Chiuso"
                onChange={(e) => onChange({ hours: venue.hours.map((x, j) => (j === i ? { ...x, hours: e.target.value } : x)) })}
                data-testid={`venue-hours-input-${i}`}
              />
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button size="lg" onClick={onSave} disabled={saving || !dirty} className="h-11 gap-2 px-6 shadow-lg shadow-orange-900/20" data-testid="venue-save-button">
          <Save className="size-4" /> {saving ? "Salvataggio…" : dirty ? "Salva modifiche" : "Tutto salvato"}
        </Button>
      </div>
    </div>
  );
}
