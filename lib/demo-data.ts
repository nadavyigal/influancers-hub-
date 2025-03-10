import { createNotification } from "./firestore"

/**
 * Creates demo notifications for testing purposes
 * @param userId The user ID to create notifications for
 */
export const createDemoNotifications = async (userId: string) => {
  // Create a welcome notification
  await createNotification({
    userId,
    title: "Welcome to Influencer's Hub",
    message: "Thank you for joining! Complete your profile to get started.",
    type: "info",
    read: false,
    link: "/dashboard/settings"
  })
  
  // Create a success notification
  await createNotification({
    userId,
    title: "Profile Updated",
    message: "Your profile has been successfully updated.",
    type: "success",
    read: false
  })
  
  // Create a warning notification
  await createNotification({
    userId,
    title: "Complete Your Profile",
    message: "Add your social media accounts to unlock all features.",
    type: "warning",
    read: false,
    link: "/dashboard/settings"
  })
  
  // Create an error notification
  await createNotification({
    userId,
    title: "Connection Error",
    message: "Unable to connect to Instagram API. Please try again later.",
    type: "error",
    read: false
  })
}

/**
 * Creates demo content for testing purposes
 * @param userId The user ID to create content for
 */
export const createDemoContent = async (userId: string) => {
  // This function will be implemented in the future
  console.log("Creating demo content for user", userId)
} 