# SkillSwap

Campus leftover items and free 25-minute knowledge sessions for **VIPS, Pitampura**.

**Live:** https://skillswap-3ca53.web.app

Students and teachers share what they know and what they need. Items are free. Meet sessions are free. Accounts use email + password.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Online accounts (Firebase)

Copy `.env.example` to `.env` and paste your Firebase web keys. Then restart the dev server.

1. Open [Firebase Console](https://console.firebase.google.com/) → Create project **SkillSwap**.
2. **Authentication** → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → Create database → production mode → paste rules from `firestore.rules`.
4. Project settings (gear) → **Add app** → Web → copy the `firebaseConfig` values into `.env`.

Passwords stay in Firebase Authentication. They are never written to Firestore.

Without `.env` keys, login still works on this computer only.

## Demo path

1. **Create account** with email + password (or **Log in**).
2. Open **Items** → request the mini-drafter.
3. Open **Knowledge** → join “Your first GitHub repo in 25 minutes”.
4. **Post** a leftover item or a Meet session.
5. **Log out**, then log in again with the same email.

## Tech

React, Vite, React Router, CSS, Lucide icons, Firebase Auth, Cloud Firestore.
