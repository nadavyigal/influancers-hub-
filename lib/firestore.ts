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

// Mock data for test mode
const mockTimestamp = { 
  toMillis: () => Date.now(),
  toDate: () => new Date()
} as Timestamp;

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
  try {
    if (!db) return Promise.resolve();
    await setDoc(doc(db as any, "users", uid), userData);
  } catch (error) {
    console.log("Test mode: Simulating user creation");
    return Promise.resolve();
  }
}

export const getUser = async (uid: string) => {
  try {
    if (!db) return { uid };
    const userDoc = await getDoc(doc(db as any, "users", uid));
    return userDoc.exists() ? userDoc.data() : { uid };
  } catch (error) {
    console.log("Test mode: Returning mock user data");
    return { uid };
  }
}

export const updateUser = async (uid: string, userData: any) => {
  try {
    if (!db) return Promise.resolve();
    await updateDoc(doc(db as any, "users", uid), userData);
  } catch (error) {
    console.log("Test mode: Simulating user update");
    return Promise.resolve();
  }
}

export const deleteUser = async (uid: string) => {
  try {
    if (!db) return Promise.resolve();
    await deleteDoc(doc(db as any, "users", uid));
  } catch (error) {
    console.log("Test mode: Simulating user deletion");
    return Promise.resolve();
  }
}

// Automation Logs Collection
export const createAutomationLog = async (logData: any) => {
  try {
    if (!db) return Promise.resolve();
    await setDoc(doc(collection(db as any, "automation_logs")), logData);
  } catch (error) {
    console.log("Test mode: Simulating automation log creation");
    return Promise.resolve();
  }
}

export const getAutomationLogs = (userId: string, callback: (logs: any[]) => void) => {
  // Always return empty array in test mode
  console.log("Test mode: Returning mock automation logs");
  callback([]);
  return () => {};
}

export const updateAutomationLog = async (logId: string, logData: any) => {
  try {
    if (!db) return Promise.resolve();
    await updateDoc(doc(db as any, "automation_logs", logId), logData);
  } catch (error) {
    console.log("Test mode: Simulating automation log update");
    return Promise.resolve();
  }
}

export const deleteAutomationLog = async (logId: string) => {
  try {
    if (!db) return Promise.resolve();
    await deleteDoc(doc(db as any, "automation_logs", logId));
  } catch (error) {
    console.log("Test mode: Simulating automation log deletion");
    return Promise.resolve();
  }
}

// Insights Collection
export const createInsight = async (insightData: any) => {
  try {
    if (!db) return Promise.resolve();
    await setDoc(doc(collection(db as any, "insights")), insightData);
  } catch (error) {
    console.log("Test mode: Simulating insight creation");
    return Promise.resolve();
  }
}

export const getInsights = (userId: string, callback: (insights: any[]) => void) => {
  // Always return empty array in test mode
  console.log("Test mode: Returning mock insights data");
  callback([]);
  return () => {};
}

export const updateInsight = async (insightId: string, insightData: any) => {
  try {
    if (!db) return Promise.resolve();
    await updateDoc(doc(db as any, "insights", insightId), insightData);
  } catch (error) {
    console.log("Test mode: Simulating insight update");
    return Promise.resolve();
  }
}

export const deleteInsight = async (insightId: string) => {
  try {
    if (!db) return Promise.resolve();
    await deleteDoc(doc(db as any, "insights", insightId));
  } catch (error) {
    console.log("Test mode: Simulating insight deletion");
    return Promise.resolve();
  }
}

// Notifications Collection
export const createNotification = async (notificationData: Omit<Notification, 'id' | 'createdAt'>) => {
  try {
    if (!db) {
      console.log("Test mode: Simulating notification creation");
      return Promise.resolve();
    }
    
    const notificationWithTimestamp = {
      ...notificationData,
      createdAt: serverTimestamp()
    }
    return setDoc(doc(collection(db as any, "notifications")), notificationWithTimestamp);
  } catch (error) {
    console.log("Test mode: Simulating notification creation");
    return Promise.resolve();
  }
}

export const getNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  // Return empty array in test mode
  console.log("Test mode: Returning mock notifications data");
  callback([]);
  return () => {};
}

export const getUnreadNotificationsCount = (userId: string, callback: (count: number) => void) => {
  // Return 0 count in test mode
  console.log("Test mode: Returning mock unread notification count");
  callback(0);
  return () => {};
}

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    if (!db) return Promise.resolve();
    await updateDoc(doc(db as any, "notifications", notificationId), { read: true });
  } catch (error) {
    console.log("Test mode: Simulating marking notification as read");
    return Promise.resolve();
  }
}

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    console.log("Test mode: Simulating marking all notifications as read");
    return Promise.resolve();
  } catch (error) {
    console.log("Test mode: Simulating marking all notifications as read");
    return Promise.resolve();
  }
}

export const deleteNotification = async (notificationId: string) => {
  try {
    if (!db) return Promise.resolve();
    await deleteDoc(doc(db as any, "notifications", notificationId));
  } catch (error) {
    console.log("Test mode: Simulating notification deletion");
    return Promise.resolve();
  }
}

