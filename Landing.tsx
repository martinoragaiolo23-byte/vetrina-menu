import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Check, Clock, MapPin, MessageCircle, Phone, QrCode, Smartphone, Sparkles, UtensilsCrossed } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const PIZZA = "https://images.unsplash.com/photo-1715607873797-a173a95fd47c?crop=entropy&cs=srgb&fm=jpg&q=80&w=900";
const PASTA = "https://images.unsplash.com/photo-1722587965667-80edfe0fe388?crop=entropy&cs=srgb&fm=jpg&q=80&w=900";
const BARBER = "https://images.unsplash.com/photo-1605497788044-5a32c7078486?crop=entropy&cs=srgb&fm=jpg&q=80&w=900";

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[290px] animate-float rounded-[2.6rem] border-[10px] border-stone-900 bg-stone-900 shadow-[0_40px_80px_-20px_rgba(28,25,23,0.45)]" data-testid="hero-phone-mockup">
      <div className="overflow-hidden rounded-[2rem] bg-linen">
        <div className="relative h-36">
          <img src={PASTA} alt="Piatto di pasta" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
          <div className="absolute bottom-3 left-4 text-white">
            <p className="font-heading text-lg font-semibold">Trattoria Da Mario</p>
            <p className="text-xs text-stone-200">Ristorante · Roma</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 p-3">
          {[
            { i: Phone, l: "Chiama" },
            { i: MessageCircle, l: "WhatsApp" },
            { i: MapPin, l: "Maps" },
          ].map(({ i: Icon, l }) => (
            <div key={l} className="flex flex-col items-center gap-1 rounded-xl bg-white py-2 text-[10px] font-medium text-stone-700 shadow-sm">
              <Icon className="size-4 text-terracotta" /> {l}
            </div>
          ))}
        </div>
        <div className="flex gap-2 px-3 text-[10px] font-semibold">
          <span className="rounded-full bg-stone-900 px-3 py-1 text-white">Primi</span>
          <span className="rounded-full bg-white px-3 py-1 text-stone-600">Antipasti</span>
          <span className="rounded-full bg-white px-3 py-1 text-stone-600">Bevande</span>
        </div>
        <div className="space-y-2 p-3">
          {[
            ["Carbonara", "Guanciale, pecorino, uovo", "13,00 €"],
            ["Cacio e pepe", "Tonnarelli freschi", "12,00 €"],
            ["Amatriciana", "Rigatoni, guanciale", "12,50 €"],
          ].map(([n, d, p]) => (
            <div key={n} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm">
              <div>
                <p className="text-xs font-semibold text-stone-900">{n}</p>
                <p className="text-[10px] text-stone-500">{d}</p>
              </div>
              <span className="text-xs font-bold text-terracotta">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { n: "01", t: "Registrati", d: "Crea l'account con email o Google. Parte subito la prova gratuita di 7 giorni." },
  { n: "02", t: "Compila il locale", d: "Nome, orari, contatti, foto e listino con categorie e prezzi." },
  { n: "03", t: "Stampa il QR", d: "Scarica il QR Code in alta risoluzione e mettilo sui tavoli o in vetrina." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-linen text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-linen/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-stone-600 md:flex">
            <a href="#funzionalita" className="transition-colors hover:text-stone-900" data-testid="nav-features-link">Funzionalità</a>
            <a href="#come-funziona" className="transition-colors hover:text-stone-900" data-testid="nav-how-link">Come funziona</a>
            <a href="#prezzi" className="transition-colors hover:text-stone-900" data-testid="nav-pricing-link">Prezzi</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/accedi" className={buttonVariants({ variant: "ghost" })} data-testid="nav-login-button">Accedi</Link>
            <Link to="/registrati" className={buttonVariants()} data-testid="nav-register-button">Prova gratis</Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-14 md:pt-20 lg:grid-cols-[1.25fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800" data-testid="hero-trial-badge">
            <Sparkles className="size-3.5" /> 7 giorni gratis · nessuna carta
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.6rem]">
            Il sito del tuo locale e il <em className="text-terracotta not-italic underline decoration-orange-300 decoration-4 underline-offset-8">Menù Digitale</em> con QR Code, pronti in 2 minuti.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-600">
            Per ristoranti, bar, pizzerie e parrucchieri. Inserisci i tuoi dati, il listino e i prezzi: MenuSito crea la pagina per smartphone con i pulsanti <strong className="text-stone-800">Chiama</strong>, <strong className="text-stone-800">WhatsApp</strong> e <strong className="text-stone-800">Google Maps</strong>.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/registrati" className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")} data-testid="hero-cta-register">
              Crea il tuo menù gratis
            </Link>
            <Link to="/locale/trattoria-da-mario" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 bg-white px-6 text-base")} data-testid="hero-cta-demo">
              Guarda un esempio
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-stone-500">
            {["Nessuna app da scaricare", "Modifiche in tempo reale", "Disdici quando vuoi"].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><Check className="size-4 text-olive" /> {t}</span>
            ))}
          </div>
        </motion.div>
        <div className="relative">
          <div className="absolute -right-6 -top-6 hidden h-40 w-40 rounded-full bg-orange-200/60 blur-3xl lg:block" />
          <PhoneMockup />
        </div>
      </section>

      <section id="funzionalita" className="border-y border-stone-200 bg-white/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">Tutto quello che serve al tuo locale. Niente di superfluo.</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-6">
            <div className="relative overflow-hidden rounded-3xl bg-stone-900 p-8 text-linen md:col-span-4" data-testid="feature-qr">
              <QrCode className="size-9 text-orange-400" />
              <h3 className="mt-6 text-2xl font-semibold">QR Code in alta risoluzione</h3>
              <p className="mt-2 max-w-md text-stone-300">Scarica il QR pronto per la stampa, con cornice "Inquadra per il menù" e numero del tavolo. Aggiorni i prezzi, il QR resta lo stesso.</p>
              <img src={PIZZA} alt="Pizza margherita" className="absolute -bottom-10 -right-10 hidden h-52 w-52 rounded-full object-cover opacity-80 md:block" />
            </div>
            <div className="rounded-3xl border border-stone-200 bg-white p-8 md:col-span-2" data-testid="feature-actions">
              <Smartphone className="size-8 text-terracotta" />
              <h3 className="mt-6 text-xl font-semibold">Pulsanti rapidi</h3>
              <p className="mt-2 text-stone-600">Chiama ora, Prenota su WhatsApp, Apri su Google Maps: un tocco e il cliente è tuo.</p>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-white p-8 md:col-span-2" data-testid="feature-menu">
              <UtensilsCrossed className="size-8 text-terracotta" />
              <h3 className="mt-6 text-xl font-semibold">Listino per categorie</h3>
              <p className="mt-2 text-stone-600">Antipasti, Pizze, Bevande o Taglio, Piega, Colore. Con foto, descrizioni e prezzi.</p>
            </div>
            <div className="relative overflow-hidden rounded-3xl md:col-span-2">
              <img src={BARBER} alt="Salone parrucchiere" className="h-full min-h-48 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/85 to-transparent" />
              <p className="absolute bottom-5 left-6 right-6 font-heading text-lg text-white">Perfetto anche per saloni e parrucchieri.</p>
            </div>
            <div className="rounded-3xl bg-orange-100 p-8 md:col-span-2" data-testid="feature-hours">
              <Clock className="size-8 text-orange-800" />
              <h3 className="mt-6 text-xl font-semibold text-orange-950">Orari sempre aggiornati</h3>
              <p className="mt-2 text-orange-900/80">I clienti vedono subito l'orario di oggi, senza chiamare.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="come-funziona" className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Online in tre passaggi</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="border-t-2 border-stone-900 pt-5" data-testid={`step-${s.n}`}>
              <span className="font-mono text-sm text-terracotta">{s.n}</span>
              <h3 className="mt-2 text-xl font-semibold">{s.t}</h3>
              <p className="mt-2 text-stone-600">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="prezzi" className="bg-stone-900 py-20 text-linen">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Un solo piano, tutto incluso.</h2>
            <p className="mt-4 max-w-md text-stone-300">Provalo gratis per 7 giorni. Alla fine della prova la tua pagina viene messa in pausa finché non attivi il Piano Pro.</p>
          </div>
          <div className="rounded-3xl bg-linen p-8 text-stone-900 shadow-2xl" data-testid="pricing-card">
            <p className="text-sm font-semibold uppercase tracking-wider text-terracotta">Piano Pro</p>
            <p className="mt-3 font-heading text-5xl font-semibold">29 €<span className="font-sans text-base font-normal text-stone-500"> /mese</span></p>
            <ul className="mt-6 space-y-2.5 text-stone-700">
              {["Pagina pubblica del locale", "Menù digitale illimitato con foto", "QR Code ad alta risoluzione", "Pulsanti Chiama, WhatsApp e Maps", "Modifiche illimitate"].map((f) => (
                <li key={f} className="flex items-center gap-2"><Check className="size-4 text-olive" /> {f}</li>
              ))}
            </ul>
            <Link to="/registrati" className={cn(buttonVariants({ size: "lg" }), "mt-8 h-12 w-full text-base")} data-testid="pricing-cta">
              Inizia 7 giorni gratis
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-10 text-sm text-stone-500 sm:flex-row sm:items-center">
        <Logo />
        <p>© {new Date().getFullYear()} MenuSito · Fatto in Italia per i locali italiani</p>
      </footer>
    </div>
  );
}
