import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { startGoogleLogin } from "@/lib/auth";

const IMG =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=srgb&fm=jpg&q=80&w=1400";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function AuthLayout({
  side,
  title,
  subtitle,
  children,
}: {
  side: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-linen lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <img src={IMG} alt="Interno di un ristorante accogliente" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,25,23,0.75)_0%,rgba(28,25,23,0.55)_55%,rgba(28,25,23,0.92)_100%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-linen">
          <Logo dark />
          <div className="max-w-md animate-rise">{side}</div>
        </div>
      </aside>
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10 animate-rise">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">{title}</h1>
          <p className="mt-2 text-stone-600">{subtitle}</p>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="mt-8 h-11 w-full gap-2 bg-white transition-colors hover:bg-stone-50"
            onClick={startGoogleLogin}
            data-testid="google-login-button"
          >
            <GoogleIcon /> Continua con Google
          </Button>
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-stone-400">
            <span className="h-px flex-1 bg-stone-200" /> oppure con email <span className="h-px flex-1 bg-stone-200" />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
