import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiPost } from "@/lib/api";
import { beginSession } from "@/lib/session";
import { queryClient } from "@/lib/queryClient";
import { ME_KEY } from "@/lib/auth";
import type { User } from "@/lib/types";
import { Logo } from "@/components/Logo";

export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const processed = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;
    const match = location.hash.match(/session_id=([^&]+)/);
    if (!match) {
      navigate("/accedi", { replace: true });
      return;
    }
    apiPost<User>("/auth/google-session", { session_id: match[1] })
      .then((user) => {
        beginSession();
        queryClient.setQueryData(ME_KEY, user);
        navigate("/dashboard", { replace: true });
      })
      .catch(() => setFailed(true));
  }, [location.hash, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-linen" data-testid="auth-callback">
      <Logo />
      {failed ? (
        <div className="text-center">
          <p className="text-stone-700">Accesso con Google non riuscito.</p>
          <a href="/accedi" className="text-terracotta underline" data-testid="auth-callback-retry-link">
            Torna al login
          </a>
        </div>
      ) : (
        <p className="text-sm text-stone-500">Accesso in corso…</p>
      )}
    </div>
  );
}
