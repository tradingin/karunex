# Payment integrations (Khalti + eSewa) — karunex

This folder contains a minimal Node.js/Express implementation for server-side verification of Khalti and eSewa payments.

Files added:
- server/payments/khalti.js — Khalti verification helper
- server/payments/esewa.js — eSewa verification helper
- server/routes/payments.js — Express routes: POST /api/payments/khalti/verify and POST /api/payments/esewa/verify
- public/khalti-checkout.html — minimal Khalti client example
- public/esewa-success.html — example eSewa return page that forwards params to server
- .env.example — environment variable placeholders

Quick setup:
1. Install dependencies (if not present):
   - npm i axios express
2. Environment variables (set in your deployment or .env):
   - KHALTI_SECRET_KEY — Khalti server secret key
   - KHALTI_VERIFY_URL — optional override for Khalti verify endpoint
   - ESEWA_MERCHANT_CODE (or ESEWA_SCD) — your merchant code (scd)
   - ESEWA_VERIFY_URL — optional override for eSewa verify endpoint (defaults to https://esewa.com.np/epay/transrec)

3. Mount the router in your Express app (example):
```js
const express = require('express');
const app = express();
app.use(express.json());
const paymentRoutes = require('./server/routes/payments');
app.use('/api', paymentRoutes);
```

Security and business logic (important):
- Always verify payments server-side. Do not trust client-only success callbacks.
- Validate amount and order id on server before marking an order as complete.
- Log verification responses for reconciliation and dispute handling.
- Use HTTPS and store secrets securely (do not commit keys).

Frontend notes:
- Khalti: use KhaltiCheckout client with your public key to obtain a token; send token + amount (in paisa) to server for verification.
- eSewa: eSewa usually redirects the user back to your success URL with query params; forward those to server to call the verification endpoint.

If you'd like, I can:
- Push these files to the branch and open a PR.
- Adapt the implementation to Django/Flask/Laravel if your backend is different.
- Add tests and database persistence logic (transaction model).