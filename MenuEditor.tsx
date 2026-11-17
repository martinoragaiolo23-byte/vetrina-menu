import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "./ImageUpload";
import { newId, type MenuCategory, type MenuItem } from "@/lib/types";

type Props = {
  menu: MenuCategory[];
  onChange: (menu: MenuCategory[]) => void;
  onSave: () => void;
  saving: boolean;
  dirty: boolean;
  serviceMode: boolean;
};

// Controlled text buffer so the field can be cleared/typed freely ("6," → 6) while the item keeps a number.
function PriceInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [text, setText] = useState(value ? String(value).replace(".", ",") : "");
  return (
    <Input
      inputMode="decimal"
      value={text}
      placeholder="0,00"
      onChange={(e) => {
        const t = e.target.value.replace(/[^\d.,]/g, "");
        setText(t);
        onChange(Math.max(0, parseFloat(t.replace(",", ".")) || 0));
      }}
      className="pl-7"
      aria-label="Prezzo"
      data-testid="menu-item-price-input"
    />
  );
}

function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

export function MenuEditor({ menu, onChange, onSave, saving, dirty, serviceMode }: Props) {
  const updateCat = (ci: number, patch: Partial<MenuCategory>) => onChange(menu.map((c, i) => (i === ci ? { ...c, ...patch } : c)));
  const updateItem = (ci: number, ii: number, patch: Partial<MenuItem>) =>
    updateCat(ci, { items: menu[ci].items.map((it, j) => (j === ii ? { ...it, ...patch } : it)) });

  const addCategory = () => onChange([...menu, { id: newId(), name: serviceMode ? "Nuovi servizi" : "Nuova categoria", items: [] }]);
  const addItem = (ci: number) =>
    updateCat(ci, { items: [...menu[ci].items, { id: newId(), name: "", description: "", price: 0, image: null, available: true }] });

  return (
    <div className="space-y-5 animate-rise" data-testid="menu-editor">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-lg text-sm text-stone-600">
          Organizza il listino in categorie ({serviceMode ? "es. Taglio, Piega, Colore" : "es. Antipasti, Primi, Pizze, Bevande"}). Ricorda di salvare le modifiche.
        </p>
        <Button variant="outline" onClick={addCategory} className="gap-2 bg-white" data-testid="menu-add-category-button">
          <Plus className="size-4" /> Aggiungi categoria
        </Button>
      </div>

      {menu.length === 0 && (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center" data-testid="menu-empty-state">
          <p className="font-heading text-xl">Il listino è ancora vuoto</p>
          <p className="mt-1 text-sm text-stone-500">Crea la prima categoria per iniziare ad aggiungere {serviceMode ? "servizi" : "piatti"}.</p>
        </div>
      )}

      {menu.map((cat, ci) => (
        <section key={cat.id} className="rounded-2xl border border-stone-200 bg-white" data-testid={`menu-category-${ci}`}>
          <header className="flex items-center gap-2 border-b border-stone-100 p-4">
            <Input
              value={cat.name}
              onChange={(e) => updateCat(ci, { name: e.target.value })}
              className="h-10 border-transparent bg-transparent font-heading text-lg font-semibold shadow-none hover:border-stone-200 focus-visible:border-input"
              aria-label="Nome categoria"
              data-testid={`menu-category-name-input-${ci}`}
            />
            <span className="whitespace-nowrap rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600">{cat.items.length} voci</span>
            <Button variant="ghost" size="icon-sm" onClick={() => onChange(move(menu, ci, -1))} aria-label="Sposta su" data-testid={`menu-category-up-${ci}`}>
              <ArrowUp className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onChange(move(menu, ci, 1))} aria-label="Sposta giù" data-testid={`menu-category-down-${ci}`}>
              <ArrowDown className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-red-700 hover:bg-red-50"
              onClick={() => {
                if (cat.items.length === 0 || window.confirm(`Eliminare la categoria “${cat.name}” e tutte le sue voci?`)) onChange(menu.filter((_, i) => i !== ci));
              }}
              aria-label="Elimina categoria"
              data-testid={`menu-category-delete-${ci}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </header>

          <div className="divide-y divide-stone-100">
            {cat.items.map((it, ii) => (
              <div key={it.id} className="grid gap-3 p-4 sm:grid-cols-[72px_1fr_auto]" data-testid={`menu-item-${ci}-${ii}`}>
                <ImageUpload value={it.image} onChange={(image) => updateItem(ci, ii, { image })} maxSize={700} label="Foto" testId={`menu-item-image-${ci}-${ii}`} className="size-[72px]" />
                <div className="grid gap-2 sm:grid-cols-[1fr_120px]">
                  <Input value={it.name} placeholder={serviceMode ? "Nome servizio" : "Nome piatto"} onChange={(e) => updateItem(ci, ii, { name: e.target.value })} data-testid="menu-item-title-input" />
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-stone-500">€</span>
                    <PriceInput value={it.price} onChange={(price) => updateItem(ci, ii, { price })} />
                  </div>
                  <Textarea
                    rows={2}
                    value={it.description}
                    placeholder="Descrizione, ingredienti, allergeni…"
                    onChange={(e) => updateItem(ci, ii, { description: e.target.value })}
                    className="min-h-14 sm:col-span-2"
                    data-testid="menu-item-description-input"
                  />
                </div>
                <div className="flex items-start gap-1 sm:flex-col sm:items-end">
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-stone-600">
                    <Checkbox checked={it.available} onCheckedChange={(v) => updateItem(ci, ii, { available: v === true })} data-testid="menu-item-available-checkbox" />
                    Disponibile
                  </label>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="ml-auto text-red-700 hover:bg-red-50"
                    onClick={() => updateCat(ci, { items: cat.items.filter((_, j) => j !== ii) })}
                    aria-label="Elimina voce"
                    data-testid="menu-item-delete-button"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3">
            <Button variant="ghost" onClick={() => addItem(ci)} className="gap-2 text-terracotta hover:bg-orange-50" data-testid="menu-add-item-button">
              <Plus className="size-4" /> Aggiungi {serviceMode ? "servizio" : "piatto"}
            </Button>
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 z-10 flex justify-end">
        <Button size="lg" onClick={onSave} disabled={saving || !dirty} className="h-11 gap-2 px-6 shadow-lg shadow-orange-900/20" data-testid="menu-item-save-button">
          <Save className="size-4" /> {saving ? "Salvataggio…" : dirty ? "Salva listino" : "Tutto salvato"}
        </Button>
      </div>
    </div>
  );
}
