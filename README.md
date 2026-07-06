# GymFlow 🏋️

A gym membership management dashboard built with **Angular 17**, **Firebase Authentication**, and **Firestore**.

## Live Demo

🌐 **[View Live App](https://gymflow-8894d.web.app)**

## Test Login Credentials

| Field    | Value                     |
|----------|---------------------------|
| Email    | `staff@gymflow.demo`      |
| Password | `GymFlow@2024`            |

> **Note:** Create this user in your Firebase Authentication console under "Email/Password" before demoing.

## Features

- 🔐 Staff login with Firebase Authentication
- 📊 Dashboard with live stats (total, active, expiring, expired)
- 👥 Create, edit, and delete members
- 🔄 Renew memberships with one click
- 🔍 Search by name and filter by plan or expiry status
- ⚠️ Members expiring within 7 days are highlighted
- ✅ Fully connected frontend ↔ Firestore backend

## Data Seeding (Initial Plans)

After deploying, seed the `plans` collection in Firestore with:

```json
// plans collection
{ "name": "Monthly",  "months": 1,  "price": 999  }
{ "name": "Quarterly","months": 3,  "price": 2499 }
{ "name": "Half Year","months": 6,  "price": 4499 }
{ "name": "Annual",   "months": 12, "price": 7999 }
```

You can do this via the Firestore console (add documents manually) or the Firebase CLI.

## Local Setup

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd gym-flow

# 2. Install dependencies
npm install

# 3. Add your Firebase config
# Edit src/environments/environment.ts with your project's credentials

# 4. Run locally
npm run start
# App runs at http://localhost:4200
```

## Deployment (Firebase Hosting)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and init
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | Angular 17 (standalone components) |
| Language   | TypeScript (strict mode)           |
| Database   | Firebase Firestore                 |
| Auth       | Firebase Authentication            |
| Hosting    | Firebase Hosting                   |
| Styling    | Vanilla CSS (custom design system) |

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── member-form/      # Add/Edit member modal
│   ├── guards/
│   │   └── auth.guard.ts     # Route protection
│   ├── models/
│   │   └── member.model.ts   # TypeScript interfaces
│   ├── pages/
│   │   ├── dashboard/        # Main dashboard
│   │   └── login/            # Login page
│   └── services/
│       ├── auth.service.ts   # Firebase Auth
│       └── member.service.ts # Firestore CRUD
└── environments/             # Firebase config
```
