// src/hooks/useTasks.js
import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const createTask = (taskData) =>
    addDoc(collection(db, 'tasks'), {
      ...taskData,
      status: 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

  const updateTask = (id, updates) =>
    updateDoc(doc(db, 'tasks', id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });

  const deleteTask = (id) => deleteDoc(doc(db, 'tasks', id));

  return { tasks, loading, createTask, updateTask, deleteTask };
}
