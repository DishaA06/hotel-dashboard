// scripts/seed-firebase.js
// Run this ONCE after setting up Firebase to create demo users and seed data.
// Usage: node scripts/seed-firebase.js
//
// Prerequisites:
//   npm install firebase-admin
//   Set FIREBASE_SERVICE_ACCOUNT env var OR update the path below.

/**
 * INSTRUCTIONS TO GET SERVICE ACCOUNT KEY:
 * 1. Go to Firebase Console → Project Settings → Service Accounts
 * 2. Click "Generate new private key"
 * 3. Save as serviceAccountKey.json in project root
 * 4. Run: node scripts/seed-firebase.js
 */

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

// Load service account
let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync('./serviceAccountKey.json', 'utf8'));
} catch (e) {
  console.error('❌ serviceAccountKey.json not found. See instructions above.');
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });

const auth = getAuth();
const db = getFirestore();

const DEMO_USERS = [
  {
    email: 'admin@hotel.com',
    password: 'demo1234',
    displayName: 'Priya Sharma',
    role: 'admin',
    name: 'Priya Sharma',
  },
  {
    email: 'house@hotel.com',
    password: 'demo1234',
    displayName: 'Anita Devi',
    role: 'housekeeping',
    name: 'Anita Devi',
  },
  {
    email: 'maint@hotel.com',
    password: 'demo1234',
    displayName: 'Ramesh Kumar',
    role: 'maintenance',
    name: 'Ramesh Kumar',
  },
];

const DEMO_TASKS = [
  {
    title: 'Deep clean room after checkout',
    type: 'Housekeeping',
    room: '204',
    priority: 'Normal',
    status: 'Pending',
    assignedTo: 'Anita Devi',
    notes: 'Guest checked out at 11am. Full linen change needed.',
  },
  {
    title: 'Fix broken AC unit',
    type: 'Maintenance',
    room: '312',
    priority: 'Urgent',
    status: 'In Progress',
    assignedTo: 'Ramesh Kumar',
    notes: 'Guest complained about noise. Check compressor.',
  },
  {
    title: 'Restock minibar',
    type: 'Housekeeping',
    room: '101',
    priority: 'Low',
    status: 'Pending',
    assignedTo: 'Anita Devi',
    notes: '',
  },
  {
    title: 'Replace bathroom light bulb',
    type: 'Maintenance',
    room: '215',
    priority: 'Normal',
    status: 'Completed',
    assignedTo: 'Ramesh Kumar',
    notes: '',
  },
  {
    title: 'Turndown service',
    type: 'Housekeeping',
    room: '401',
    priority: 'Normal',
    status: 'Pending',
    assignedTo: 'Anita Devi',
    notes: 'VIP guest, add welcome chocolates.',
  },
  {
    title: 'Fix leaking tap in bathroom',
    type: 'Maintenance',
    room: '108',
    priority: 'Urgent',
    status: 'Pending',
    assignedTo: 'Ramesh Kumar',
    notes: 'Guest reported water on floor.',
  },
];

async function seed() {
  console.log('🌱 Seeding Firebase demo data…\n');

  // Create users
  for (const user of DEMO_USERS) {
    try {
      let uid;
      try {
        const existing = await auth.getUserByEmail(user.email);
        uid = existing.uid;
        console.log(`  ↩ User exists: ${user.email}`);
      } catch {
        const created = await auth.createUser({
          email: user.email,
          password: user.password,
          displayName: user.displayName,
        });
        uid = created.uid;
        console.log(`  ✓ Created user: ${user.email}`);
      }

      // Write profile to Firestore
      await db.doc(`users/${uid}`).set({
        email: user.email,
        name: user.name,
        role: user.role,
      }, { merge: true });
    } catch (err) {
      console.error(`  ✗ Error with ${user.email}:`, err.message);
    }
  }

  console.log('\n📋 Creating demo tasks…');

  // Check if tasks already exist
  const existing = await db.collection('tasks').limit(1).get();
  if (!existing.empty) {
    console.log('  ↩ Tasks already exist, skipping.');
  } else {
    const { Timestamp } = await import('firebase-admin/firestore');
    for (const task of DEMO_TASKS) {
      await db.collection('tasks').add({
        ...task,
        createdBy: 'Priya Sharma',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      console.log(`  ✓ Task: "${task.title}" — Room ${task.room}`);
    }
  }

  console.log('\n✅ Seed complete! You can now log in with:');
  console.log('   admin@hotel.com / demo1234  (Admin)');
  console.log('   house@hotel.com / demo1234  (Housekeeping)');
  console.log('   maint@hotel.com / demo1234  (Maintenance)');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
