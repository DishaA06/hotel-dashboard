# 🏨 StayOps — Hotel Operations Dashboard

A minimal, clean MVP for small hotels to manage housekeeping and maintenance tasks digitally — replacing WhatsApp messages and paper checklists.

---

## ✨ Features

- **Role-based login** — Admin, Housekeeping, Maintenance
- **Task management** — Create, update status, and delete tasks
- **Task statuses** — Pending → In Progress → Completed
- **Filters** — By status, type (Housekeeping/Maintenance), and search
- **Priority system** — Low, Normal, Urgent (urgent tasks pinned to top)
- **Live updates** — Firebase Firestore real-time sync
- **Stats bar** — At-a-glance counts for all task states

---

## 🛠 Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Routing | React Router v6 |

---

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo>
cd hotel-dashboard
npm install
```

### 2. Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → name it (e.g. `stayops-hotel`)
3. Disable Google Analytics (not needed for MVP)

### 3. Enable Firebase Services

**Authentication:**
- Sidebar → Build → Authentication → Get Started
- Sign-in method → Email/Password → Enable → Save

**Firestore Database:**
- Sidebar → Build → Firestore Database → Create Database
- Select **Start in test mode** (for development)
- Choose a region close to your users → Done

### 4. Get Firebase Config

- Project Settings (gear icon) → Your Apps → Add App → Web (`</>`)
- Register app → Copy the `firebaseConfig` object

### 5. Add Config to Project

Open `src/lib/firebase.js` and replace the placeholder values:

```js
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"

  
  // measurementId: "G-5P50W74SFX"
};
```

### 6. Seed Demo Users & Tasks

```bash
# Install admin SDK (only for seeding)
npm install --save-dev firebase-admin

# Download service account key:
# Firebase Console → Project Settings → Service Accounts → Generate new private key
# Save as: serviceAccountKey.json (in project root)

node scripts/seed-firebase.js
```

This creates 3 demo accounts and 6 sample tasks.

### 7. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 👤 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin / Front Desk | admin@hotel.com | demo1234 |
| Housekeeping | house@hotel.com | demo1234 |
| Maintenance | maint@hotel.com | demo1234 |

---

## 🗂 Project Structure

```
hotel-dashboard/
├── src/
│   ├── lib/
│   │   └── firebase.js          # Firebase init & config
│   ├── context/
│   │   └── AuthContext.jsx      # Auth state + role profile
│   ├── hooks/
│   │   └── useTasks.js          # CRUD + Firestore real-time
│   ├── components/
│   │   ├── TaskCard.jsx         # Individual task card
│   │   ├── CreateTaskModal.jsx  # New task form modal
│   │   ├── StatsBar.jsx         # Summary counts
│   │   └── ProtectedRoute.jsx   # Auth guard
│   ├── pages/
│   │   ├── LoginPage.jsx        # Sign-in screen
│   │   └── DashboardPage.jsx    # Main operations view
│   ├── App.jsx                  # Router setup
│   └── main.jsx                 # Entry point
├── scripts/
│   └── seed-firebase.js         # Demo data seeder
├── firestore.rules              # Security rules
└── index.html
```

---

## 🔐 Firestore Security Rules

Deploy rules from `firestore.rules`:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

---

## 🏗 Build for Production

```bash
npm run build
# Output in /dist — deploy to Vercel, Netlify, Firebase Hosting, etc.
```

**Deploy to Firebase Hosting:**
```bash
npm install -g firebase-tools
firebase init hosting
npm run build
firebase deploy
```

---

## 📋 Firestore Data Model

### `users/{uid}`
```json
{
  "name": "Priya Sharma",
  "email": "admin@hotel.com",
  "role": "admin"  // "admin" | "housekeeping" | "maintenance"
}
```

### `tasks/{taskId}`
```json
{
  "title": "Clean room after checkout",
  "type": "Housekeeping",
  "room": "204",
  "priority": "Normal",
  "status": "Pending",
  "assignedTo": "Anita Devi",
  "notes": "Full linen change needed.",
  "createdBy": "Priya Sharma",
  "createdAt": "Timestamp",
  "updatedAt": "Timestamp"
}
```

---

## 🎯 MVP Scope (What's Included)

- ✅ Email/password authentication
- ✅ Role-based profiles (stored in Firestore)
- ✅ Create tasks with type, room, priority, assignee, notes
- ✅ Update task status (Pending → In Progress → Completed → Reopen)
- ✅ Delete tasks (admin only)
- ✅ Filter by status, type, search query
- ✅ Urgency grouping — urgent tasks shown first
- ✅ Real-time updates via Firestore `onSnapshot`
- ✅ Stats summary bar

## ❌ Out of Scope (by design)
- Push notifications
- AI or smart scheduling
- Analytics or reporting
- File/photo attachments
- Guest-facing features
- Multi-property support



PROJECT MEMBERS:
PRANAV KSHIRSAGAR
KANISHKA ARDE 
DISHA OZA
DIVYA KHANDARE