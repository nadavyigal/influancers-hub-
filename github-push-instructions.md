# GitHub Push Instructions

Follow these steps to push your code to the GitHub repository:

## 1. Create the Repository (if not already created)

1. Go to [GitHub](https://github.com) and sign in
2. Click on the "+" icon in the top right corner and select "New repository"
3. Set the repository name to "influancers-hub-"
4. Add a description: "Influencers Hub - A platform for managing social media influencer activities"
5. Choose "Public" visibility
6. Do not initialize with a README (we'll push our own)
7. Click "Create repository"

## 2. Initialize Git in Your Project (if not already initialized)

Open a terminal in your project root directory and run:

```bash
git init
```

## 3. Add Your GitHub Repository as Remote

```bash
git remote add origin https://github.com/nadavyigal/influancers-hub-.git
```

## 4. Create .gitignore (already exists in your project)

Your project already has a .gitignore file, but make sure it includes:

```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

## 5. Add and Commit Your Files

```bash
git add .
git commit -m "Initial commit: Influencers Hub platform"
```

## 6. Push to GitHub

```bash
git push -u origin main
```

If your default branch is named "master" instead of "main", use:

```bash
git push -u origin master
```

## 7. Verify the Push

Go to https://github.com/nadavyigal/influancers-hub- to verify that your code has been pushed successfully.

## Note About Sensitive Information

Make sure your `.env.local` file is included in `.gitignore` to avoid pushing sensitive information like API keys to GitHub. If you need to share environment variables with collaborators, consider using a `.env.example` file with placeholder values. 