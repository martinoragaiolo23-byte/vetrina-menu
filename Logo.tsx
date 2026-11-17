import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#C2410C" />
      <path d="M10 8v7a3 3 0 0 0 3 3v6M10 8v5M13 8v5M16 8v7a3 3 0 0 1-3 3" stroke="#FFF7ED" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M21 8c-1.8 1.2-2.5 3.5-2.5 6.5h2.5V24" stroke="#FFF7ED" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24.5" cy="7.5" r="1.6" fill="#FDBA74" />
    </svg>
  );
}

export function Logo({ dark = false, to = "/" }: { dark?: boolean; to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2" data-testid="brand-logo-link">
      <LogoMark />
      <span className={cn("font-heading text-xl font-semibold tracking-tight", dark ? "text-linen" : "text-stone-900")}>
        Menu<span className="text-terracotta">Sito</span>
      </span>
    </Link>
  );
}
