import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-linen px-6 text-center" data-testid="not-found-page">
      <Logo />
      <h1 className="text-4xl font-semibold">Pagina non trovata</h1>
      <p className="max-w-sm text-stone-600">L'indirizzo che hai aperto non esiste o è stato spostato.</p>
      <Link to="/" className={buttonVariants({ size: "lg" })} data-testid="not-found-home-link">
        Torna alla home
      </Link>
    </div>
  );
}
