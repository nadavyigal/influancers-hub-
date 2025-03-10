# Influencers Hub

A comprehensive platform for managing social media influencer activities, content creation, and audience engagement.

## Features

- User authentication with email and Google sign-in
- Profile management with social media handles
- Content creation and management
- Notification system
- Dashboard with analytics
- Responsive UI built with Next.js and Tailwind CSS
- AI-powered assistance with Agency Swarm integration

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: Firebase Storage
- **AI**: Agency Swarm, OpenAI
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account
- OpenAI API key (for AI Assistant features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nadavyigal/influancers-hub-.git
   cd influancers-hub-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Optional: For AI Assistant features
   # OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password and Google)
3. Create a Firestore database
4. Set up Firebase Storage
5. Create the necessary Firestore indexes for queries

## AI Assistant

The platform includes an AI Assistant powered by [Agency Swarm](https://github.com/VRSEN/agency-swarm), which provides:

- Content creation assistance (ideas, writing, review)
- Influencer management (research, campaign planning, outreach)
- Analytics and insights

To use the AI Assistant:
1. Navigate to the AI Assistant page
2. Enter your OpenAI API key
3. Select a team based on your needs
4. Describe your request
5. Review and implement the suggestions

For more details, see the [Agency Swarm integration documentation](lib/agency-swarm/README.md).

## License

MIT 