import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, deleteDoc, doc, where, onSnapshot, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export function subscribeToCitizens(callback: (citizens: string[]) => void) {
  const q = query(collection(db, "citizens"));
  return onSnapshot(q, (querySnapshot) => {
    const docsData: Array<{ name: string; createdAt?: string; order?: number }> = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name) {
        docsData.push({
          name: data.name.trim(),
          createdAt: data.createdAt,
          order: data.order
        });
      }
    });

    docsData.sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 99999;
      const orderB = b.order !== undefined ? b.order : 99999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });

    const uniqueNames: string[] = [];
    docsData.forEach((item) => {
      if (!uniqueNames.includes(item.name)) {
        uniqueNames.push(item.name);
      }
    });

    callback(uniqueNames);
  }, (error) => {
    console.error("Firestore real-time sync error:", error);
  });
}

export async function logActivity(action: string): Promise<void> {
  try {
    await addDoc(collection(db, "activity_logs"), {
      action,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error("Failed to log activity:", e);
  }
}

export function subscribeToActivityLogs(callback: (logs: Array<{ action: string; timestamp: string }>) => void) {
  const q = query(collection(db, "activity_logs"));
  return onSnapshot(q, (querySnapshot) => {
    const list: Array<{ action: string; timestamp: string }> = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.action && data.timestamp) {
        list.push({
          action: data.action,
          timestamp: data.timestamp
        });
      }
    });

    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    callback(list.slice(0, 10));
  }, (error) => {
    console.error("Firestore activity logs sync error:", error);
  });
}

export async function clearActivityLogs(): Promise<boolean> {
  try {
    const q = query(collection(db, "activity_logs"));
    const querySnapshot = await getDocs(q);
    const batchPromises: Promise<void>[] = [];
    querySnapshot.forEach((docSnap) => {
      batchPromises.push(deleteDoc(doc(db, "activity_logs", docSnap.id)));
    });
    await Promise.all(batchPromises);
    return true;
  } catch (e) {
    console.error("Firestore clear logs error:", e);
    return false;
  }
}

export async function fetchCitizens(): Promise<string[]> {
  try {
    const q = query(collection(db, "citizens"));
    const querySnapshot = await getDocs(q);
    const docsData: Array<{ name: string; createdAt?: string; order?: number }> = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name) {
        docsData.push({
          name: data.name.trim(),
          createdAt: data.createdAt,
          order: data.order
        });
      }
    });

    docsData.sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 99999;
      const orderB = b.order !== undefined ? b.order : 99999;
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });

    const uniqueNames: string[] = [];
    docsData.forEach((item) => {
      if (!uniqueNames.includes(item.name)) {
        uniqueNames.push(item.name);
      }
    });

    return uniqueNames;
  } catch (e) {
    console.error("Firestore fetch error:", e);
    return [];
  }
}

export async function addCitizen(name: string): Promise<boolean> {
  const trimmedName = name.trim();
  if (!trimmedName) return false;

  try {
    await addDoc(collection(db, "citizens"), {
      name: trimmedName,
      createdAt: new Date().toISOString()
    });
    await logActivity(`Registered citizen "${trimmedName}"`);
    return true;
  } catch (e) {
    console.error("Firestore add error:", e);
    return false;
  }
}

export async function deleteCitizen(name: string): Promise<boolean> {
  const trimmedName = name.trim();
  if (!trimmedName) return false;

  try {
    const q = query(collection(db, "citizens"), where("name", "==", trimmedName));
    const querySnapshot = await getDocs(q);
    const batchPromises: Promise<void>[] = [];
    querySnapshot.forEach((docSnap) => {
      batchPromises.push(deleteDoc(doc(db, "citizens", docSnap.id)));
    });
    await Promise.all(batchPromises);
    await logActivity(`Removed citizen "${trimmedName}"`);
    return true;
  } catch (e) {
    console.error("Firestore delete error:", e);
    return false;
  }
}

export async function updateCitizen(oldName: string, newName: string): Promise<boolean> {
  const trimmedOldName = oldName.trim();
  const trimmedNewName = newName.trim();
  if (!trimmedOldName || !trimmedNewName) return false;

  try {
    const q = query(collection(db, "citizens"), where("name", "==", trimmedOldName));
    const querySnapshot = await getDocs(q);
    const batchPromises: Promise<void>[] = [];
    querySnapshot.forEach((docSnap) => {
      batchPromises.push(updateDoc(doc(db, "citizens", docSnap.id), {
        name: trimmedNewName
      }));
    });
    await Promise.all(batchPromises);
    await logActivity(`Renamed "${trimmedOldName}" to "${trimmedNewName}"`);
    return true;
  } catch (e) {
    console.error("Firestore update error:", e);
    return false;
  }
}

export async function updateCitizensOrder(orderedNames: string[]): Promise<boolean> {
  try {
    const batchPromises: Promise<void>[] = [];
    
    for (let i = 0; i < orderedNames.length; i++) {
      const name = orderedNames[i];
      const q = query(collection(db, "citizens"), where("name", "==", name));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
        batchPromises.push(updateDoc(doc(db, "citizens", docSnap.id), {
          order: i
        }));
      });
    }
    
    await Promise.all(batchPromises);
    await logActivity("Re-organized citizens directory order");
    return true;
  } catch (e) {
    console.error("Firestore reorder error:", e);
    return false;
  }
}

export interface StaffUser {
  email: string;
}

export function subscribeToAuthChanges(callback: (user: StaffUser | null) => void) {
  return onAuthStateChanged(auth, (firebaseUser: User | null) => {
    if (firebaseUser) {
      callback({ email: firebaseUser.email || '' });
    } else {
      callback(null);
    }
  });
}

export async function loginStaff(email: string, password: string): Promise<StaffUser> {
  const cleanEmail = email.trim().toLowerCase();
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return {
      email: userCredential.user.email || ''
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to log in via Firebase Auth.");
  }
}

export async function logoutStaff(): Promise<void> {
  await signOut(auth);
}
