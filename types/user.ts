export type AppUserProfile = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  createdAt: number;
  updatedAt: number;
  isOnboardingComplete?: boolean;
  instagramHandle?: string;
  youtubeHandle?: string;
  twitterHandle?: string;
  tiktokHandle?: string;
  linkedinHandle?: string;
  interests?: string[];
  contentTypes?: string[];
}; 