# Auth testing (Emergent Google Auth + email/password)
- Easiest: log in with email/password from /app/memory/test_credentials.md.
- Session alternative: insert into db `app`: users {user_id,email,name,created_at,trial_ends_at,plan:'trial'} and user_sessions {user_id, session_token, expires_at}; send `Authorization: Bearer <token>` or cookie `session_token`.
- Callback route: any URL with `#session_id=...` is handled by AuthCallback → POST /api/auth/google-session.
