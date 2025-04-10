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

// Create mock timestamp
const mockTimestamp = { 
  seconds: Math.floor(Date.now() / 1000),
  nanoseconds: 0,
  toDate: () => new Date(),
  toMillis: () => Date.now(),
  isEqual: () => false,
  valueOf: () => "",
  toJSON: () => ({ seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 })
} as unknown as Timestamp;

// Mock content for testing
const mockContent: ContentItem = {
  id: "mock-content-id",
  userId: "test-user-id",
  title: "Mock Content",
  description: "This is a mock content item for testing",
  contentType: "image",
  styleType: "Consistency",
  mediaUrls: ["https://via.placeholder.com/640x480.png"],
  hashtags: ["#test", "#mock"],
  status: "draft",
  createdAt: mockTimestamp,
  updatedAt: mockTimestamp
};

export async function createContent(content: Omit<ContentItem, "id" | "createdAt" | "updatedAt">): Promise<string> {
  try {
    // In test mode, just return a mock ID
    console.log("Test mode: Creating mock content");
    return "mock-content-id-" + Date.now();
  } catch (error) {
    console.error("Error creating content:", error);
    return "mock-error-content-id";
  }
}

export async function updateContent(id: string, updates: Partial<ContentItem>): Promise<void> {
  try {
    console.log("Test mode: Updating mock content", id, updates);
    return Promise.resolve();
  } catch (error) {
    console.error("Error updating content:", error);
    return Promise.resolve();
  }
}

export async function getContent(id: string): Promise<ContentItem> {
  try {
    console.log("Test mode: Getting mock content", id);
    return { ...mockContent, id };
  } catch (error) {
    console.error("Error getting content:", error);
    return { ...mockContent, id };
  }
}

export async function getUserContent(userId: string): Promise<ContentItem[]> {
  try {
    console.log("Test mode: Getting mock user content for", userId);
    // Return an array of mock content items
    return [
      { ...mockContent, id: "mock-content-1", title: "First Mock Content" },
      { ...mockContent, id: "mock-content-2", title: "Second Mock Content" },
      { ...mockContent, id: "mock-content-3", title: "Third Mock Content" },
    ];
  } catch (error) {
    console.error("Error getting user content:", error);
    return [];
  }
}

export async function deleteContent(id: string): Promise<void> {
  try {
    console.log("Test mode: Deleting mock content", id);
    return Promise.resolve();
  } catch (error) {
    console.error("Error deleting content:", error);
    return Promise.resolve();
  }
}

export async function uploadContentMedia(userId: string, file: File): Promise<string> {
  try {
    console.log("Test mode: Uploading mock content media");
    // Return a placeholder image URL
    return "https://via.placeholder.com/640x480.png?text=Mock+Upload";
  } catch (error) {
    console.error("Error uploading content media:", error);
    return "https://via.placeholder.com/640x480.png?text=Mock+Error";
  }
} 