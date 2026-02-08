# 📱 PWA + SMS Reading Setup Guide

Complete guide to convert this app into a Progressive Web App with SMS reading capabilities.

## Table of Contents

1. [PWA Installation](#pwa-installation)
2. [SMS Reading Implementation](#sms-reading-implementation)
3. [Testing the PWA](#testing-the-pwa)
4. [Production Deployment](#production-deployment)

---

## PWA Installation

### ✅ Already Configured

The following are already set up in this project:

- ✅ `manifest.json` with app metadata
- ✅ PWA configuration in `next.config.js`
- ✅ Service worker via `next-pwa`
- ✅ Meta tags in `layout.tsx`
- ✅ Offline support

### 🎨 Add App Icons

1. **Generate Icons** (see `/public/ICONS_GUIDE.md`)

2. **Place in `/public` folder**:
   ```
   public/
   ├── icon-72x72.png
   ├── icon-96x96.png
   ├── icon-128x128.png
   ├── icon-144x144.png
   ├── icon-152x152.png
   ├── icon-192x192.png
   ├── icon-384x384.png
   └── icon-512x512.png
   ```

3. **Optional: Add screenshots** to `manifest.json`:
   ```json
   "screenshots": [
     {
       "src": "/screenshot1.png",
       "sizes": "1280x720",
       "type": "image/png"
     }
   ]
   ```

### 📦 Build & Test

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Start production server
npm start
```

---

## SMS Reading Implementation

### Current Status

✅ **Demo Mode**: The app currently shows simulated SMS transactions
⚠️ **Real SMS**: Requires native app capabilities

### Option 1: Using Capacitor (Recommended)

Capacitor allows you to wrap your web app and access native features.

#### 1. Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npx cap init ExpenseTracker com.yourcompany.expensetracker
```

#### 2. Add Android Platform

```bash
npm install @capacitor/android
npx cap add android
```

#### 3. Install SMS Plugin

```bash
npm install @capawesome-team/capacitor-android-foreground-service
npm install capacitor-sms-plugin
```

#### 4. Update `useSMSReader.ts`

Replace the simulated SMS reading with real implementation:

```typescript
import { SMS } from 'capacitor-sms-plugin';

const readSMSMessages = async (): Promise<Expense[]> => {
  try {
    // Request permission
    const permission = await SMS.requestPermission();
    
    if (permission.granted) {
      // Read SMS from the last 30 days
      const messages = await SMS.listSMS({
        filter: 'inbox',
        maxCount: 100
      });

      const expenses: Expense[] = [];
      
      for (const msg of messages.messages) {
        const parsed = parseTransaction(msg.body);
        if (parsed) {
          expenses.push({
            id: `sms-${msg.date}`,
            amount: parsed.amount,
            description: parsed.description,
            category: parsed.category,
            date: new Date(msg.date).toISOString().split('T')[0],
            notes: `From: ${msg.address}`,
            createdAt: new Date(msg.date).toISOString(),
          });
        }
      }
      
      return expenses;
    }
  } catch (error) {
    console.error('Error reading SMS:', error);
  }
  
  return [];
};
```

#### 5. Update Android Permissions

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.RECEIVE_SMS" />
```

#### 6. Build & Sync

```bash
npm run build
npx cap copy
npx cap sync
```

#### 7. Open in Android Studio

```bash
npx cap open android
```

#### 8. Build APK

In Android Studio:
- Build → Generate Signed Bundle/APK
- Follow the wizard to create release APK

### Option 2: Using React Native

If you prefer React Native:

1. **Create React Native project**:
   ```bash
   npx react-native init ExpenseTrackerMobile
   ```

2. **Install SMS library**:
   ```bash
   npm install react-native-get-sms-android
   ```

3. **Request permissions** and read SMS using the library

4. **Reuse** your business logic from this web app

### Option 3: WebOTP API (Limited)

For bank OTP verification only (not full SMS reading):

```typescript
if ('OTPCredential' in window) {
  const ac = new AbortController();
  
  navigator.credentials.get({
    otp: { transport: ['sms'] },
    signal: ac.signal
  }).then(otp => {
    console.log('OTP received:', otp.code);
  });
}
```

**Note**: WebOTP API only works for OTP extraction, not general SMS reading.

---

## Testing the PWA

### Desktop Testing

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Open Chrome DevTools**:
   - Application → Manifest
   - Verify manifest is loaded
   - Check service worker status

3. **Install locally**:
   - Chrome: Address bar → Install icon
   - Edge: Settings → Apps → Install

### Mobile Testing (Android)

#### Via Chrome Mobile

1. **Deploy to Vercel** (or any HTTPS host)

2. **Open in Chrome Mobile**

3. **Test installation**:
   - Menu (⋮) → "Install app"
   - Or banner should appear automatically

4. **Test offline**:
   - Enable airplane mode
   - App should still work

#### Via Android Studio Emulator

1. **Build with Capacitor** (see above)

2. **Run in emulator**:
   ```bash
   npx cap run android
   ```

3. **Test SMS reading**:
   - Use Emulator Extended Controls
   - Send test SMS messages
   - Verify app reads them

### iOS Testing

iOS has restrictions on SMS reading. Options:

1. **Manual entry only** (current implementation)
2. **Use shared OTP API** for bank verification
3. **Enterprise app** with special permissions

---

## Production Deployment

### 1. Deploy Web App to Vercel

```bash
# Push to GitHub
git push origin main

# Deploy automatically via Vercel integration
# Or manually:
vercel --prod
```

### 2. Build Android APK

```bash
# Full production build
npm run build
npx cap copy
npx cap sync android

# Open Android Studio
npx cap open android

# Generate signed APK:
# Build → Generate Signed Bundle/APK → APK
# Select release variant
# Sign with your keystore
```

### 3. Publish to Google Play

1. **Create developer account**: https://play.google.com/console
   - Pay $25 registration fee

2. **Create new app**:
   - Fill in store listing
   - Add screenshots
   - Set content rating
   - Set pricing (Free)

3. **Upload APK/AAB**:
   - Go to Production → Create new release
   - Upload signed bundle
   - Set version number

4. **Submit for review**:
   - Complete all required sections
   - Submit app
   - Wait for approval (1-3 days)

### 4. Update Strategy

```bash
# Update version in package.json
# Build new version
npm run build
npx cap copy
npx cap sync

# Generate new APK
# Upload to Play Console
# Users get automatic updates
```

---

## Privacy & Permissions

### Required Disclosures

When publishing, you must disclose:

1. **SMS Permission Usage**:
   - "Read SMS messages to automatically import bank transactions"
   - "All processing is local, no data sent to servers"

2. **Data Handling**:
   - Data stored locally on device
   - No cloud backup without user consent
   - No third-party sharing

3. **Privacy Policy**:
   - Create one (required for Play Store)
   - Host on your website
   - Link in app and store listing

### Best Practices

- Only request SMS permission when user taps "Import from SMS"
- Show explanation before requesting permission
- Provide manual entry alternative
- Allow user to delete imported transactions
- Clear explanation of what data is accessed

---

## Troubleshooting

### PWA Not Installing

**Problem**: Install banner doesn't appear

**Solutions**:
- Ensure served over HTTPS
- Check manifest.json is valid
- Verify service worker is registered
- Must have at least 2 visits to site

### SMS Reading Not Working

**Problem**: Permission denied or not reading

**Solutions**:
- Check Android version (API 23+)
- Verify permissions in AndroidManifest.xml
- Request permission at runtime
- Test on real device (not emulator for production testing)

### Build Errors

**Problem**: Capacitor build fails

**Solutions**:
```bash
# Clear cache
npx cap sync --force

# Clean Android
cd android && ./gradlew clean

# Rebuild
npm run build
npx cap copy
```

---

## Next Steps

1. ✅ Generate app icons
2. ✅ Test PWA locally
3. ✅ Deploy to Vercel
4. 🔄 Install Capacitor
5. 🔄 Implement real SMS reading
6. 🔄 Build Android APK
7. 🔄 Test on real device
8. 🔄 Create privacy policy
9. 🔄 Publish to Play Store

---

## Resources

- [Next-PWA Docs](https://github.com/shadowwalker/next-pwa)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Permissions Guide](https://developer.android.com/guide/topics/permissions/overview)
- [Play Store Publishing](https://support.google.com/googleplay/android-developer/answer/9859152)

---

**Questions?** Open an issue or check the main README.md

Good luck with your PWA! 🚀📱
