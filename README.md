# 💰 Expense Tracker - Next.js

A modern, feature-rich expense tracking application built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-latest-000000)

## ✨ Features

- 📱 **Progressive Web App** - Install on mobile devices, works offline
- 📲 **SMS Auto-Import** - Automatically read bank transaction SMS (native app mode)
- 📊 **Visual Dashboard** - Beautiful charts showing spending breakdown and trends using Recharts
- 💳 **Easy Expense Entry** - Quick form to add expenses with categories
- 📈 **Smart Insights** - AI-powered recommendations to improve spending habits
- 🔒 **Privacy First** - All SMS processing happens locally on your device
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 💾 **Local Storage** - All data persists in browser localStorage
- 🌙 **Dark Mode Ready** - Theme system built-in (can be activated)
- ⚡ **Fast & Optimized** - Built with Next.js App Router for optimal performance
- 🚀 **Installable** - Add to home screen on mobile for app-like experience

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Installation

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Setup

1. **Extract the project files**

2. **Install dependencies**:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com).

#### Option 1: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Vercel will auto-detect Next.js and configure everything
6. Click "Deploy"

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Option 3: Deploy Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_REPO_URL)

### Other Deployment Options

- **Netlify**: Connect your Git repository and deploy
- **AWS Amplify**: Use the Amplify Console
- **Railway**: One-click deployment from GitHub
- **Self-hosted**: Build and run on your own server

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
expense-tracker-nextjs/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx             # Main page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── textarea.tsx
│   │   ├── ExpenseChart.tsx     # Pie chart component
│   │   ├── TrendChart.tsx       # Line chart component
│   │   └── InsightsPanel.tsx    # Insights component
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   └── types/
│       └── index.ts             # TypeScript types
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🎯 Features Breakdown

### Dashboard
- Monthly spending overview
- Total transactions count
- Top spending category
- Interactive pie chart for category breakdown
- Line chart for daily spending trends

### Add Expense
- Amount input with validation
- Category selection (9 categories)
- Description field
- Date picker
- Optional notes field
- **SMS Auto-Import** button

### SMS Auto-Import (PWA Feature)
- Automatically read bank transaction SMS
- Smart transaction detection and parsing
- Auto-categorization based on merchant
- Privacy-first (all processing is local)
- Preview before importing
- Duplicate detection

### History
- All expenses listed chronologically
- Category icons for easy identification
- Delete functionality
- Responsive design
- Import source tracking

### Insights
- Monthly spending analysis
- Category-wise breakdown
- Large transaction warnings
- Savings recommendations
- Spending frequency analysis

## 📱 PWA Installation

This app is a **Progressive Web App** and can be installed on your device:

### On Mobile (Android/iOS)

1. **Open in mobile browser** (Chrome/Safari)
2. **Tap menu** (⋮ or share icon)
3. **Select "Install App"** or "Add to Home Screen"
4. **Confirm** installation

### On Desktop (Chrome/Edge)

1. **Look for install icon** in address bar
2. **Click** to install
3. **App opens in standalone window**

### PWA Benefits

- ✅ Works offline
- ✅ Fast loading
- ✅ Home screen icon
- ✅ Full-screen experience
- ✅ Push notifications (future)
- ✅ Background sync (future)

## 📲 SMS Reading Setup

For **automatic expense tracking from SMS**, see the detailed guide:

👉 **[PWA_SETUP.md](./PWA_SETUP.md)** - Complete PWA & SMS setup guide

### Quick Start (Demo Mode)

The app currently includes **demo mode** with simulated transactions:

1. Click "Import from SMS" button
2. View sample bank transactions
3. Preview detected expenses
4. Import to your tracker

### Production SMS Reading

For **real SMS reading** on Android:

1. Convert to native app using **Capacitor** (recommended)
2. Add SMS permissions
3. Build Android APK
4. Install on device
5. Grant SMS permissions

See [PWA_SETUP.md](./PWA_SETUP.md) for detailed instructions.

### Privacy & Security

- 🔒 All SMS processing is **100% local**
- ❌ No data sent to servers
- ✅ You control what gets imported
- ✅ Delete imported transactions anytime
- ✅ Permission requested only when needed

## 🎨 Customization

### Categories

Edit categories in `src/app/page.tsx`:

```typescript
const CATEGORIES = [
  { value: "Food & Dining", label: "Food & Dining", icon: "🍔" },
  // Add more categories...
];
```

### Colors

Modify theme colors in `src/app/globals.css`:

```css
:root {
  --primary: 262 83% 58%; /* Purple */
  /* Modify other colors... */
}
```

### Charts

Customize charts in `src/components/ExpenseChart.tsx` and `src/components/TrendChart.tsx`.

## 🔮 Future Enhancements

### Planned Features

- [x] PWA support
- [x] SMS auto-import (demo mode)
- [ ] Real SMS reading (native app)
- [ ] Budget setting and alerts
- [ ] Export data to CSV/PDF
- [ ] Multi-currency support
- [ ] Cloud sync (Firebase/Supabase)
- [ ] Recurring expenses
- [ ] Receipt photo upload
- [ ] Category-wise budgets
- [ ] Monthly comparisons
- [ ] Spending limits with alerts
- [ ] Income tracking
- [ ] Investment tracking
- [ ] Bill reminders
- [ ] Split expenses with friends

### Native App Features

When built as native app with Capacitor:

- [ ] Background SMS monitoring
- [ ] Push notifications for expenses
- [ ] Biometric authentication
- [ ] Widget support
- [ ] Share target (share receipts to app)
- [ ] Camera integration for receipts

## 📞 Support & Documentation

### Guides

- 📖 [README.md](./README.md) - Main documentation
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- 📱 [PWA_SETUP.md](./PWA_SETUP.md) - PWA & SMS setup guide
- 🎨 [ICONS_GUIDE.md](./public/ICONS_GUIDE.md) - Icon generation guide

### External Resources

- [Next.js documentation](https://nextjs.org/docs)
- [shadcn/ui documentation](https://ui.shadcn.com/)
- [Capacitor documentation](https://capacitorjs.com/docs)
- [Vercel documentation](https://vercel.com/docs)

### Issues & Questions

For issues or questions:
- Open an issue on GitHub
- Check existing documentation
- Review PWA_SETUP.md for native features

---

Built with ❤️ using Next.js and shadcn/ui
