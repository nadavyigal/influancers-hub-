import { db, storage } from "./firebase";
import { collection, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy, doc, Timestamp, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface ContentItem {
  id?: string;
  userId: string;
  title: string;
  description: string;
  contentType: string; // "image", "video", "carousel", "reel"
  styleType: string; // "Consistency" or "New Styles"
  mediaUrls: string[];
  hashtags: string[];
  status: "draft" | "processing" | "completed" | "published";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp;
  instagramPostId?: string;
  aiInsights?: string;
  performanceMetrics?: {
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    reach?: number;
    impressions?: number;
  };
}

export async function createContent(content: Omit<ContentItem, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    const now = Timestamp.now();
    const contentWithTimestamps = {
      ...content,
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await addDoc(collection(db, "content"), contentWithTimestamps);
    return docRef.id;
  } catch (error) {
    console.error("Error creating content:", error);
    throw new Error("Failed to create content");
  }
}

export async function updateContent(id: string, updates: Partial<ContentItem>): Promise<void> {
  try {
    const contentRef = doc(db, "content", id);
    await updateDoc(contentRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating content:", error);
    throw new Error("Failed to update content");
  }
}

export async function getContent(id: string): Promise<ContentItem> {
  try {
    const contentRef = doc(db, "content", id);
    const contentSnap = await getDoc(contentRef);
    
    if (!contentSnap.exists()) {
      throw new Error("Content not found");
    }
    
    return { id: contentSnap.id, ...contentSnap.data() } as ContentItem;
  } catch (error) {
    console.error("Error getting content:", error);
    throw new Error("Failed to get content");
  }
}

export async function getUserContent(userId: string): Promise<ContentItem[]> {
  try {
    const contentQuery = query(
      collection(db, "content"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(contentQuery);
    const content: ContentItem[] = [];
    
    querySnapshot.forEach((doc) => {
      content.push({ id: doc.id, ...doc.data() } as ContentItem);
    });
    
    return content;
  } catch (error) {
    console.error("Error getting user content:", error);
    throw new Error("Failed to get user content");
  }
}

export async function deleteContent(id: string): Promise<void> {
  try {
    const contentRef = doc(db, "content", id);
    await deleteDoc(contentRef);
  } catch (error) {
    console.error("Error deleting content:", error);
    throw new Error("Failed to delete content");
  }
}

export async function uploadContentMedia(userId: string, file: File): Promise<string> {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `content/${userId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading content media:", error);
    throw new Error("Failed to upload content media");
  }
} 