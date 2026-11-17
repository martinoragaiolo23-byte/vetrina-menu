// Hand-written mirrors of backend/models/*.py — keep in sync.

export type Plan = "trial" | "pro" | "expired";

export interface Subscription {
  plan: Plan;
  is_active: boolean;
  trial_ends_at: string;
  days_left: number;
  pro_since: string | null;
  price_eur: number;
}

export interface User {
  user_id: string;
  email: string;
  name: string;
  picture: string | null;
  created_at: string;
  subscription: Subscription;
}

export type VenueCategory = "ristorante" | "pizzeria" | "bar" | "parrucchiere" | "altro";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface OpeningDay {
  day: string;
  hours: string;
}

export interface VenueIn {
  slug: string;
  name: string;
  category: VenueCategory;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  description: string;
  hours: OpeningDay[];
  logo: string | null;
  cover: string | null;
  menu: MenuCategory[];
}

export interface Venue extends VenueIn {
  id: string;
  owner_id: string;
  updated_at: string;
}

export interface PublicVenueOut {
  status: "active" | "blocked";
  venue: Venue | null;
  name: string;
}

export const CATEGORY_LABELS: Record<VenueCategory, string> = {
  ristorante: "Ristorante / Trattoria",
  pizzeria: "Pizzeria",
  bar: "Bar / Bistrot",
  parrucchiere: "Parrucchiere / Salone",
  altro: "Altra attività",
};

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

export function errorMessage(err: unknown, fallback = "Si è verificato un errore"): string {
  const body = (err as { body?: { detail?: unknown } } | null)?.body;
  if (body && typeof body.detail === "string") return body.detail;
  if (body && Array.isArray(body.detail)) return "Controlla i campi inseriti";
  return fallback;
}

export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function newId(): string {
  return crypto.randomUUID();
}

export function publicUrl(slug: string): string {
  return `${window.location.origin}/locale/${slug}`;
}

export function whatsappLink(num: string, venueName: string): string {
  let digits = num.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith("3")) digits = `39${digits}`;
  const text = encodeURIComponent(`Ciao ${venueName}, vorrei prenotare. `);
  return `https://wa.me/${digits}?text=${text}`;
}

export function mapsLink(v: Pick<Venue, "name" | "address" | "city">): string {
  const q = [v.name, v.address, v.city].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
