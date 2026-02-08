# 🚀 Deployment Guide

This guide will help you deploy your Expense Tracker app to Vercel and prepare it for app stores.

## 📋 Table of Contents

1. [Deploy to Vercel](#deploy-to-vercel)
2. [Custom Domain Setup](#custom-domain-setup)
3. [Environment Variables](#environment-variables)
4. [Progressive Web App (PWA)](#progressive-web-app-pwa)
5. [Native Mobile Apps](#native-mobile-apps)

---

## Deploy to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Automatic Deployments**
   - Every push to `main` branch will auto-deploy to production
   - Pull requests create preview deployments

### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # First deployment (creates project)
   vercel
   
   # Production deployment
   vercel --prod
   ```

### Method 3: Direct Upload

1. Build your project locally:
   ```bash
   npm run build
   ```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Drag and drop your project folder
4. Vercel will deploy it

---

## Custom Domain Setup

1. **Add Domain in Vercel Dashboard**
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **DNS Configuration**
   - For apex domain (example.com):
     ```
     A Record: 76.76.21.21
     ```
   
   - For www subdomain:
     ```
     CNAME Record: cname.vercel-dns.com
     ```

3. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - Usually takes 5-10 minutes

---

## Environment Variables

Currently, this app doesn't require environment variables as it uses localStorage. 

If you add backend features in the future:

1. **Create `.env.local` file**:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   DATABASE_URL=your_database_url
   ```

2. **Add to Vercel**:
   - Go to Project Settings → Environment Variables
   - Add each variable
   - Redeploy for changes to take effect

---

## Progressive Web App (PWA)

Make your app installable on mobile devices:

### 1. Install next-pwa

```bash
npm install next-pwa
```

### 2. Update next.config.js

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  reactStrictMode: true,
})
```

### 3. Create public/manifest.json

```json
{
  "name": "Expense Tracker",
  "short_name": "ExpenseTracker",
  "description": "Track your expenses and manage finances",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#8b5cf6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 4. Add Icons

Create app icons (192x192 and 512x512) and place them in `/public`.

### 5. Update layout.tsx

```tsx
export const metadata = {
  manifest: '/manifest.json',
  // ... other metadata
}
```

### 6. Deploy

After deploying, users can "Add to Home Screen" on mobile devices!

---

## Native Mobile Apps

To publish on Google Play Store and Apple App Store:

### Option 1: React Native (Recommended)

1. **Use React Native Web**
   - Reuse your React components
   - Share business logic
   - Platform-specific UI when needed

2. **Setup React Native project**
   ```bash
   npx react-native init ExpenseTrackerMobile
   ```

3. **Add SMS Reading**
   
   **Android** (AndroidManifest.xml):
   ```xml
   <uses-permission android:name="android.permission.READ_SMS" />
   <uses-permission android:name="android.permission.RECEIVE_SMS" />
   ```
   
   **Use library**: `react-native-sms-retriever` or `react-native-get-sms-android`

4. **Build for stores**:
   ```bash
   # Android
   cd android && ./gradlew assembleRelease
   
   # iOS
   cd ios && pod install
   # Then build in Xcode
   ```

### Option 2: Capacitor

Convert your web app to native:

1. **Install Capacitor**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```

2. **Add platforms**
   ```bash
   npm install @capacitor/android @capacitor/ios
   npx cap add android
   npx cap add ios
   ```

3. **Build web app**
   ```bash
   npm run build
   npx cap copy
   ```

4. **Open in native IDE**
   ```bash
   npx cap open android
   npx cap open ios
   ```

5. **Add SMS plugin**
   ```bash
   npm install @capacitor-community/sms-retriever
   ```

### Publishing Steps

#### Google Play Store

1. Create developer account ($25 one-time fee)
2. Create signed APK/AAB
3. Fill in store listing
4. Upload build
5. Submit for review

#### Apple App Store

1. Enroll in Apple Developer Program ($99/year)
2. Create App ID in Apple Developer
3. Create app in App Store Connect
4. Upload build via Xcode
5. Submit for review

---

## Performance Optimization

### Before Production

1. **Optimize Images**
   ```bash
   npm install sharp
   ```
   Use Next.js Image component

2. **Enable Compression**
   Already enabled in Vercel

3. **Analyze Bundle**
   ```bash
   npm run build
   # Check .next/analyze
   ```

4. **Add Analytics**
   - Vercel Analytics (built-in)
   - Google Analytics
   - Plausible (privacy-friendly)

---

## Monitoring

### Vercel Dashboard

- Real-time logs
- Function invocations
- Build logs
- Performance metrics

### Error Tracking

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

---

## Backup Strategy

### Option 1: GitHub Backups
Automatic with GitHub integration

### Option 2: Manual Backups
```bash
git clone YOUR_REPO
cd YOUR_REPO
git pull
```

### Option 3: Database Backups
(When you add a database)
- Use automated backup tools
- Export to JSON regularly

---

## Scaling

As your app grows:

1. **Add Backend**: Use Next.js API routes or separate backend
2. **Database**: PostgreSQL, MongoDB, or Supabase
3. **Authentication**: NextAuth.js, Clerk, or Auth0
4. **Cloud Storage**: AWS S3 for receipts/images
5. **CDN**: Vercel Edge Network (included)

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel
- Test locally: `npm run build`
- Verify all dependencies installed

### Deployment Slow
- Reduce bundle size
- Use dynamic imports
- Optimize images

### App Not Loading
- Check browser console
- Verify API endpoints
- Check Vercel function logs

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Add custom domain
3. ✅ Enable PWA
4. ✅ Set up monitoring
5. 🔄 Add backend (optional)
6. 🔄 Build native apps
7. 🔄 Publish to app stores

---

**Questions?** Check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)

Good luck with your deployment! 🚀
