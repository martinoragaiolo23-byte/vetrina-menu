# Test credentials

| Role | Email | Password | Notes |
|---|---|---|---|
| Owner (active trial) | martinoragaiolo23@gmail.com | MenuSito2026! | venue slug `trattoria-da-mario` |
| Owner (trial expired) | demo-scaduto@menusito.it | Demo2026! | venue slug `pizzeria-bella-napoli` → public page blocked |

Google login: Emergent-managed OAuth (no app password). See /app/auth_testing.md.
Re-seed: `cd /app/backend && python seed.py` (resets passwords + re-expires the demo account).
Note: "Simula scadenza prova" on the main owner ends their trial; "Attiva Piano Pro" restores access.
