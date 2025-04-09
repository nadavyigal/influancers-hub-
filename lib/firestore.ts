import { db } from "./firebase"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  type Firestore,
  type DocumentData,
  type QuerySnapshot,
  type DocumentReference,
  type WriteBatch,
  getDocs,
  writeBatch
} from "firebase/firestore"

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  link?: string;
  createdAt: Timestamp;
}

// Users Collection
export const createUser = async (uid: string, userData: any) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  await setDoc(doc(db as Firestore, "users", uid), userData)
}

export const getUser = async (uid: string) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  const userDoc = await getDoc(doc(db as Firestore, "users", uid))
  return userDoc.exists() ? userDoc.data() : null
}

export const updateUser = async (uid: string, userData: any) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  await updateDoc(doc(db as Firestore, "users", uid), userData)
}

export const deleteUser = async (uid: string) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  await deleteDoc(doc(db as Firestore, "users", uid))
}

// Automation Logs Collection
export const createAutomationLog = async (logData: any) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  await setDoc(doc(collection(db as Firestore, "automation_logs")), logData)
}

export const getAutomationLogs = (userId: string, callback: (logs: any[]) => void) => {
  if (!db) {
    console.error("Firebase Firestore is not initialized");
    callback([]);
    return () => {};
  }
  
  const q = query(collection(db as Firestore, "automation_logs"), where("userId", "==", userId))
  return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const logs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(logs)
  })
}

export const updateAutomationLog = async (logId: string, logData: any) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  await updateDoc(doc(db as Firestore, "automation_logs", logId), logData)
}

export const deleteAutomationLog = async (logId: string) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  await deleteDoc(doc(db as Firestore, "automation_logs", logId))
}

// Insights Collection
export const createInsight = async (insightData: any) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  await setDoc(doc(collection(db as Firestore, "insights")), insightData)
}

export const getInsights = (userId: string, callback: (insights: any[]) => void) => {
  if (!db) {
    console.error("Firebase Firestore is not initialized");
    callback([]);
    return () => {};
  }
  
  const q = query(collection(db as Firestore, "insights"), where("userId", "==", userId))
  return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    const insights = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(insights)
  })
}

export const updateInsight = async (insightId: string, insightData: any) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  await updateDoc(doc(db as Firestore, "insights", insightId), insightData)
}

export const deleteInsight = async (insightId: string) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  await deleteDoc(doc(db as Firestore, "insights", insightId))
}

// Notifications Collection
export const createNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
  if (!db) {
    console.log("Firebase Firestore is not initialized, skipping notification creation")
    // Return a resolved promise instead of throwing an error
    return Promise.resolve()
  }
  
  const notificationWithTimestamp = {
    ...notificationData,
    createdAt: serverTimestamp()
  }
  return setDoc(doc(collection(db as Firestore, "notifications")), notificationWithTimestamp)
}

export const getNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  if (!db) {
    console.error("Firebase Firestore is not initialized");
    callback([]);
    return () => {};
  }
  
  // Simplified query - just filter by userId without ordering
  // This avoids the need for a composite index
  const q = query(
    collection(db as Firestore, "notifications"), 
    where("userId", "==", userId)
  );
  
  return onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
    // Sort the results in memory instead of in the query
    const notifications = querySnapshot.docs
      .map((doc) => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Notification[];
    
    // Sort by createdAt in descending order (newest first)
    notifications.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
    
    // Limit to 50 notifications after sorting
    callback(notifications.slice(0, 50));
  });
}

export const getUnreadNotificationsCount = (userId: string, callback: (count: number) => void) => {
  if (!db) {
    console.error("Firebase Firestore is not initialized");
    callback(0);
    return () => {};
  }
  
  // Query for unread notifications for this user
  const q = query(
    collection(db as Firestore, "notifications"), 
    where("userId", "==", userId),
    where("read", "==", false)
  );
  
  // This query might require a composite index
  // If it fails, we'll need to create the index in the Firebase console
  return onSnapshot(
    q, 
    (querySnapshot) => {
      // Success handler
      callback(querySnapshot.size);
    },
    (error) => {
      // Error handler
      console.error("Error getting unread notification count:", error);
      
      // If we get an index error, fall back to a simpler query and filter in memory
      if (error.code === 'failed-precondition') {
        console.log("Falling back to simpler query for unread notifications");
        
        // Create a simpler query that doesn't require a composite index
        const simpleQuery = query(
          collection(db as Firestore, "notifications"),
          where("userId", "==", userId)
        );
        
        // Set up a new listener with the simpler query
        const unsubscribe = onSnapshot(simpleQuery, (snapshot) => {
          // Filter for unread notifications in memory
          const unreadCount = snapshot.docs.filter(doc => doc.data().read === false).length;
          callback(unreadCount);
        });
        
        return unsubscribe;
      }
      
      // For other errors, just return 0
      callback(0);
    }
  );
}

export const markNotificationAsRead = async (notificationId: string) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  await updateDoc(doc(db as Firestore, "notifications", notificationId), { read: true })
}

export const markAllNotificationsAsRead = async (userId: string) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  
  const q = query(
    collection(db as Firestore, "notifications"), 
    where("userId", "==", userId),
    where("read", "==", false)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return; // No unread notifications to update
  }
  
  // Create a batch
  const batch = writeBatch(db as Firestore);
  
  // Add each document to the batch
  querySnapshot.forEach((docSnapshot) => {
    batch.update(docSnapshot.ref, { read: true });
  });
  
  // Commit the batch
  await batch.commit();
}

export const deleteNotification = async (notificationId: string) => {
  if (!db) throw new Error("Firebase Firestore is not initialized");
  await deleteDoc(doc(db as Firestore, "notifications", notificationId))
}

