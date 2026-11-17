# MenuSito — SPEC

Italian SaaS: venue owners (ristoranti, bar, pizzerie, parrucchieri) build a mobile public page + digital menu + QR code.

## Auth
- Email+password (`POST /api/auth/register|login`) and Emergent Google OAuth (`POST /api/auth/google-session {session_id}`).
- Both set httpOnly `session_token` cookie (secure, samesite=none). Bearer header also accepted. `GET /api/auth/me`, `POST /api/auth/logout`.
- Frontend routes: `/`, `/accedi` (alias `/login`), `/registrati`, `/dashboard?tab=overview|info|menu|qr|plan`, `/locale/:slug`.

## Data model (Mongo)
- users: user_id, email, name, picture, password_hash, created_at, trial_ends_at (created+7d), plan ("trial"|"pro"), pro_since
- user_sessions: session_token, user_id, expires_at (TTL)
- venues (1 per user, auto-created on first `GET /api/venue`): id, owner_id, slug (unique), name, category (ristorante|pizzeria|bar|parrucchiere|altro), city, address, phone, whatsapp, description, hours[{day,hours}], logo/cover (data URLs, client-resized webp), menu[{id,name,items[{id,name,description,price,image,available}]}]

## Subscription (PAYMENT SIMULATED)
- Active = plan pro OR now < trial_ends_at. Expired → `GET /api/public/venues/{slug}` returns `{status:"blocked"}` and page shows lock screen.
- `POST /api/subscription/activate` (simulated checkout dialog), `/cancel`, `/simulate-expiry` (demo button ends trial now).

## Venue API
- `GET /api/venue`, `PUT /api/venue` (whole VenueIn; slug slugified, 409 if taken by another owner).

## Seed (`cd /app/backend && python seed.py`)
- martinoragaiolo23@gmail.com / MenuSito2026! → "Trattoria Da Mario", slug `trattoria-da-mario`, trial active, 3 categories / 7 items.
- demo-scaduto@menusito.it / Demo2026! → "Pizzeria Bella Napoli", slug `pizzeria-bella-napoli`, trial EXPIRED (public page blocked).

## QR
- qrcode.react; framed PNG 2000x2700 table card, plain PNG 1600px, SVG.
