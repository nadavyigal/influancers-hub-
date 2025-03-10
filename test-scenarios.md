# Test Scenarios for Influencer's Hub

## 1. Authentication System Test Scenarios

### 1.1 Sign Up Test
1. Navigate to `/login`
2. Click on the "Sign Up" tab
3. Enter a valid email address
4. Enter a password (at least 8 characters)
5. Confirm the password
6. Click "Sign Up"
7. **Expected Result**: User is redirected to the onboarding flow
8. **Verification**: User profile is created in Firestore with `isOnboardingComplete: false`

### 1.2 Login Test
1. Navigate to `/login`
2. Enter a valid email address
3. Enter the correct password
4. Check "Remember Me" (optional)
5. Click "Sign In"
6. **Expected Result**: User is redirected to the dashboard (if onboarding is complete) or onboarding flow (if not complete)
7. **Verification**: User's `lastLoginAt` timestamp is updated in Firestore

### 1.3 Google Sign-In Test
1. Navigate to `/login`
2. Click "Sign in with Google"
3. Complete the Google authentication flow
4. **Expected Result**: User is redirected to the dashboard (if onboarding is complete) or onboarding flow (if not complete)
5. **Verification**: User profile is created or updated in Firestore

### 1.4 Password Reset Test
1. Navigate to `/login`
2. Click "Forgot your password?"
3. Enter the email address
4. Click "Send Reset Link"
5. **Expected Result**: Success message is displayed
6. **Verification**: Password reset email is sent to the user's email address

### 1.5 Invalid Credentials Test
1. Navigate to `/login`
2. Enter an email address
3. Enter an incorrect password
4. Click "Sign In"
5. **Expected Result**: Error message is displayed
6. **Verification**: User remains on the login page

### 1.6 Protected Route Test
1. Log out of the application
2. Attempt to access `/dashboard` directly
3. **Expected Result**: User is redirected to the login page
4. **Verification**: Dashboard content is not visible

## 2. Onboarding Process Test Scenarios

### 2.1 New User Onboarding Test
1. Sign up with a new account
2. **Expected Result**: User is automatically redirected to the onboarding flow
3. **Verification**: Onboarding UI is displayed with the first step active

### 2.2 Onboarding Step Navigation Test
1. Complete the first step of onboarding (Basic Profile)
2. Click "Next"
3. Complete the second step (Social Media)
4. Click "Next"
5. Complete the third step (Interests)
6. Click "Complete"
7. **Expected Result**: Success message is displayed and user is redirected to the dashboard
8. **Verification**: User profile is updated in Firestore with `isOnboardingComplete: true`

### 2.3 Onboarding Validation Test
1. In the first step of onboarding, leave the display name empty
2. Click "Next"
3. **Expected Result**: Validation error is displayed
4. **Verification**: User remains on the first step

### 2.4 Onboarding Back Navigation Test
1. Navigate to the second step of onboarding
2. Click "Back"
3. **Expected Result**: User is returned to the first step
4. **Verification**: First step UI is displayed with previously entered data

### 2.5 Onboarding Completion Test
1. Complete all steps of onboarding
2. **Expected Result**: Completion screen is displayed with a "Go to Dashboard" button
3. **Verification**: Demo notifications are created for the user

## 3. Dashboard/Home View Test Scenarios

### 3.1 Dashboard Loading Test
1. Log in to the application
2. **Expected Result**: Dashboard loads with metrics and charts
3. **Verification**: All dashboard components are visible

### 3.2 Dashboard Navigation Test
1. Log in to the application
2. Click on different sidebar navigation items
3. **Expected Result**: Content changes to reflect the selected navigation item
4. **Verification**: URL changes to match the selected section

### 3.3 Dashboard Responsive Layout Test
1. Log in to the application
2. Resize the browser window to different sizes
3. **Expected Result**: Layout adjusts responsively
4. **Verification**: All content remains accessible at different screen sizes

### 3.4 Sidebar Toggle Test
1. Log in to the application
2. Click the sidebar toggle button in the header
3. **Expected Result**: Sidebar collapses/expands
4. **Verification**: Content area adjusts to the new sidebar state

## 4. User Settings and Profile Test Scenarios

### 4.1 Profile Display Test
1. Navigate to `/dashboard/settings`
2. **Expected Result**: User profile information is displayed
3. **Verification**: Form fields are populated with the user's current data

### 4.2 Profile Update Test
1. Navigate to `/dashboard/settings`
2. Update the display name
3. Update the bio
4. Update social media handles
5. Click "Save Changes"
6. **Expected Result**: Success message is displayed
7. **Verification**: User profile is updated in Firestore

### 4.3 Account Management Test
1. Navigate to `/dashboard/settings`
2. Click on the "Account" tab
3. **Expected Result**: Account management options are displayed
4. **Verification**: Email address is displayed (read-only)

### 4.4 Account Deletion Test
1. Navigate to `/dashboard/settings`
2. Click on the "Account" tab
3. Click "Delete Account"
4. Type "DELETE" in the confirmation field
5. Click "Delete Account" in the dialog
6. **Expected Result**: Account is deleted and user is redirected to the login page
7. **Verification**: User data is removed from Firestore

## 5. Notification System Test Scenarios

### 5.1 Notification Display Test
1. Log in to the application
2. Observe the notification icon in the header
3. **Expected Result**: Notification badge displays the number of unread notifications
4. **Verification**: Badge count matches the number of unread notifications in Firestore

### 5.2 Notification Center Test
1. Log in to the application
2. Click the notification icon in the header
3. **Expected Result**: Notification center popover opens
4. **Verification**: Notifications are listed with the most recent at the top

### 5.3 Mark Notification as Read Test
1. Log in to the application
2. Click the notification icon in the header
3. Click "Mark as read" on an unread notification
4. **Expected Result**: Notification is marked as read
5. **Verification**: Notification's `read` status is updated in Firestore

### 5.4 Mark All Notifications as Read Test
1. Log in to the application
2. Click the notification icon in the header
3. Click "Mark all as read"
4. **Expected Result**: All notifications are marked as read
5. **Verification**: All notifications' `read` status is updated in Firestore

### 5.5 Delete Notification Test
1. Log in to the application
2. Click the notification icon in the header
3. Click the delete button on a notification
4. **Expected Result**: Notification is removed from the list
5. **Verification**: Notification is deleted from Firestore

## 6. Error Handling Test Scenarios

### 6.1 Form Validation Test
1. Navigate to `/login`
2. Submit the form without entering any data
3. **Expected Result**: Validation errors are displayed
4. **Verification**: Form is not submitted

### 6.2 API Error Handling Test
1. Simulate a network error during an API call
2. **Expected Result**: Error message is displayed to the user
3. **Verification**: Application remains functional

### 6.3 Authentication Error Recovery Test
1. Attempt to sign in with invalid credentials
2. **Expected Result**: Error message is displayed
3. **Verification**: User can retry with correct credentials

### 6.4 Session Expiration Test
1. Simulate a session expiration
2. Attempt to perform an action requiring authentication
3. **Expected Result**: User is redirected to the login page
4. **Verification**: Error message explains that the session has expired 