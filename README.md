# Minimind - Cross-Platform Productivity Suite

A minimalist, secure, and offline-first productivity application that combines the best features of Trello, minimalist task management, and encrypted note-taking in one unified platform.

## 🚀 Features

### 📋 Trello-Style Boards
- Drag-and-drop card management
- Customizable lists and columns
- Real-time collaboration
- Board templates and organization

### ✅ Minimalist Task Management
- Clean, distraction-free interface
- Priority levels and due dates
- Subtask support
- Quick task creation and completion

### 📝 Encrypted Notes
- End-to-end encryption for privacy
- Rich text editing capabilities
- Note organization and search
- Secure cloud sync

### 🔒 Security & Privacy
- Client-side encryption (Web Crypto API)
- Secure authentication (NextAuth.js)
- No data readable by third parties
- GDPR compliant

### 📱 Cross-Platform Support
- **iOS**: Install as PWA via Safari
- **Android**: Install via Chrome/Edge
- **Web**: Works in any modern browser
- **Linux/Windows/Mac**: Desktop PWA support

### 🔄 Offline-First Architecture
- Full functionality without internet
- Automatic sync when connection restored
- Conflict resolution for simultaneous edits
- Local data persistence

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern UI components
- **DaisyUI** - Additional component library

### Backend & Database
- **Neon PostgreSQL** - Serverless database (10GB free tier)
- **Drizzle ORM** - Type-safe database queries
- **NextAuth.js** - Authentication framework

### Offline & Sync
- **IndexedDB + Dexie.js** - Local browser storage
- **TanStack Query** - Data fetching and caching
- **Service Workers** - PWA offline functionality

### Encryption & Security
- **Web Crypto API** - Client-side encryption
- **bcryptjs** - Password hashing
- **crypto-js** - Additional crypto utilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Neon account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd minimind
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure your environment**
Edit `.env.local` with your credentials:
```env
# Database
DATABASE_URL="postgresql://username:password@hostname/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Encryption
ENCRYPTION_KEY="your-32-character-encryption-key"
```

5. **Set up the database**
```bash
npm run db:generate
npm run db:push
```

6. **Start the development server**
```bash
npm run dev
```

7. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Installing as PWA

### iOS
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will appear on your home screen

### Android
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home Screen"

### Desktop (Linux/Windows/Mac)
1. Open the app in Chrome/Edge
2. Look for the install icon in the address bar
3. Click "Install" when prompted

## 🗂 Project Structure

```
minimind/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── dashboard/         # Main app interface
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Authentication components
│   ├── boards/           # Board management
│   ├── tasks/            # Task management
│   └── notes/            # Notes components
├── lib/                  # Utility functions
│   ├── db/              # Database configuration
│   ├── auth/            # Authentication setup
│   ├── encryption/      # Encryption utilities
│   └── offline/         # Offline storage
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## 🔧 Development

### Database Management
```bash
# Generate migrations
npm run db:generate

# Push schema changes
npm run db:push

# View database
npm run db:studio
```

### Build and Deploy
```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
npm run deploy
```

## 🔐 Security Features

### Encryption
- All sensitive data is encrypted client-side before storage
- Uses AES-256-GCM encryption
- Encryption keys are derived from user passwords
- Zero-knowledge architecture

### Authentication
- Secure password hashing with bcrypt
- Session management with NextAuth.js
- Protection against common attacks (CSRF, XSS)

### Privacy
- No tracking or analytics
- Data stays encrypted even on servers
- Local-first architecture
- User controls all data

## 🆘 Troubleshooting

### Common Issues

**PWA not installing on iOS:**
- Ensure you're using Safari (not Chrome)
- Check that the app is served over HTTPS in production

**Offline functionality not working:**
- Clear browser cache and reload
- Check Service Worker registration in DevTools

**Database connection issues:**
- Verify your Neon connection string
- Check if your IP is whitelisted in Neon dashboard

**Encryption errors:**
- Ensure ENCRYPTION_KEY is exactly 32 characters
- Clear IndexedDB if switching encryption keys

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

For issues and questions:
- Check the [documentation](docs/)
- Search existing [issues](issues)
- Create a new issue if needed

---

Built with ❤️ for productivity enthusiasts who value privacy and simplicity.