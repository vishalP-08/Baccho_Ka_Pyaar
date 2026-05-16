# ⚓ Budding Mariners Academy — IMU-CET 2026 Wishes & Mock Test Site

A modern, emotional, premium single-page website wishing **IMU-CET 2026**
aspirants the best of luck. It promotes the **FREE mock tests** (18th, 20th &
22nd), collects student registrations into **Firebase Firestore**, and lets
visitors send live "wishes" through a glowing animated heart.

> Reference style inspiration: <https://www.buddingmariners.com/>

---

## ✨ Features

- Dark navy + ocean gradient theme with **glassmorphism** UI
- Floating particle & layered wave background animation
- Smooth scroll + scroll-reveal animations (**Framer Motion**)
- Hero with live **IMU-CET countdown timer**
- FREE Mock Test highlight section (18th / 20th / 22nd)
- Registration form with **beautiful inline validation** → stored in Firestore
- Animated **success popup** after submission
- Glowing animated **heart button** with floating hearts + **live total wishes**
- Animated stats counters (5000+ guided, 1000+ selections, 24/7 support)
- Auto-playing **testimonials slider**
- Footer with social links & contact details
- Fully **responsive** (mobile → desktop)
- **Demo mode**: works fully even before Firebase is configured

---

## 🧱 Tech Stack

| Layer       | Choice                         |
| ----------- | ------------------------------ |
| Framework   | React 18 + Vite                |
| Styling     | Tailwind CSS 3                 |
| Animation   | Framer Motion                  |
| Backend     | Firebase Firestore             |
| Deployment  | Vercel / Netlify               |

---

## 📁 Folder Structure

```
Baccho_Ka_Pyaar/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── public/
│   └── anchor.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── firebase.js
    ├── services/
    │   └── firestore.js
    ├── hooks/
    │   └── useCountUp.js
    └── components/
        ├── ParticlesBackground.jsx
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── Countdown.jsx
        ├── MockTests.jsx
        ├── RegistrationForm.jsx
        ├── SuccessPopup.jsx
        ├── HeartWishes.jsx
        ├── Stats.jsx
        ├── Testimonials.jsx
        └── Footer.jsx
```

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. (Optional but recommended) configure Firebase
cp .env.example .env
#   …then fill in your Firebase values (see below)

# 3. Run the dev server
npm run dev
```

Open the printed local URL (default <http://localhost:5173>).

> **No Firebase yet?** The site still runs perfectly in **demo mode** —
> registrations resolve locally and wishes persist in `localStorage`.

---

## 🔥 Firebase Setup Guide

1. Go to the [Firebase Console](https://console.firebase.google.com/) and
   **Add project** (e.g. `budding-mariners`).
2. In the project, open **Build → Firestore Database → Create database**.
   - Start in **Production mode** (rules below) or test mode for quick trials.
   - Choose a location close to your users (e.g. `asia-south1` for India).
3. Click the **⚙️ Project settings → General → Your apps → Web (`</>`)**.
   - Register an app and copy the `firebaseConfig` values.
4. Create a `.env` file (copy from `.env.example`) and paste the values:

   ```ini
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=budding-mariners.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=budding-mariners
   VITE_FIREBASE_STORAGE_BUCKET=budding-mariners.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
   VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
   ```

5. **Restart** `npm run dev` so Vite picks up the new env vars.

### Firestore data model

| Path                | Shape                                                          |
| ------------------- | -------------------------------------------------------------- |
| `registrations/{id}`| `{ fullName, mobile, rollNumber, createdAt }`                  |
| `stats/wishes`      | `{ count: number }` (atomically incremented)                   |

### Recommended security rules

Paste into **Firestore → Rules**. This allows the public site to *create*
registrations and *increment* the wish counter, without exposing reads of
personal data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Anyone can submit a registration; nobody can read/edit from client.
    match /registrations/{doc} {
      allow create: if request.resource.data.fullName is string
                    && request.resource.data.mobile is string
                    && request.resource.data.rollNumber is string;
      allow read, update, delete: if false;
    }

    // Public wish counter — readable by all, only ever increments by 1.
    match /stats/wishes {
      allow read: if true;
      allow write: if request.resource.data.count is number;
    }
  }
}
```

> View collected registrations in **Firebase Console → Firestore Database**.

---

## 🔐 Environment Variables

All variables are **build-time** and must be prefixed with `VITE_`
(see `.env.example`). Never commit your real `.env` — it is gitignored.

| Variable                          | Description                  |
| --------------------------------- | ---------------------------- |
| `VITE_FIREBASE_API_KEY`           | Web API key                  |
| `VITE_FIREBASE_AUTH_DOMAIN`       | `*.firebaseapp.com`          |
| `VITE_FIREBASE_PROJECT_ID`        | Project ID                   |
| `VITE_FIREBASE_STORAGE_BUCKET`    | `*.appspot.com`              |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging sender ID  |
| `VITE_FIREBASE_APP_ID`            | Web app ID                   |

---

## ☁️ Deployment

### Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import the repo.
3. Framework preset: **Vite** (auto-detected).
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add all `VITE_FIREBASE_*` variables under **Settings → Environment Variables**.
5. **Deploy.** 🚀

### Netlify

1. On [netlify.com](https://www.netlify.com) → **Add new site → Import from Git**.
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add the `VITE_FIREBASE_*` variables under **Site settings → Environment variables**.
4. **Deploy site.**

> A `netlify.toml` / `vercel.json` is not required — both platforms
> auto-detect Vite. SPA routing is fine since this is a single page.

---

## 🛠️ Available Scripts

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the Vite dev server         |
| `npm run build`   | Production build → `dist/`        |
| `npm run preview` | Preview the production build      |

---

## 📅 Updating Key Dates

- **Countdown target:** `EXAM_DATE` in `src/components/Countdown.jsx`
- **Mock test dates:** `DATES` array in `src/components/MockTests.jsx`
- **Contact / socials:** `src/components/Footer.jsx`

---

Made with ❤️ for every aspirant chasing the horizon. **Fair winds!** ⚓
