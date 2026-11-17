import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./api";
import type { User, Venue } from "./types";

export const ME_KEY = ["me"] as const;
export const VENUE_KEY = ["venue"] as const;

export function useMe() {
  return useQuery({ queryKey: ME_KEY, queryFn: () => apiGet<User>("/auth/me"), retry: false });
}

export function useVenue(enabled: boolean) {
  return useQuery({ queryKey: VENUE_KEY, queryFn: () => apiGet<Venue>("/venue"), enabled });
}

// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
export function startGoogleLogin(): void {
  const redirectUrl = window.location.origin + "/dashboard";
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
}
