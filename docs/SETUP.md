# Setup Guide

This guide will walk you through setting up Minimind from scratch, including database configuration, authentication setup, and deployment.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** for version control
- **Neon account** (free tier available at [neon.tech](https://neon.tech))

## Step 1: Project Setup

### Clone and Install
```bash
# Clone the repository
git clone <your-repo-url>
cd mytrello

# Install dependencies
npm install
```

### Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local
```

## Step 2: Database Setup

### Create Neon Database

1. **Sign up for Neon**
   - Go to [neon.tech](https://neon.tech)
   - Create a free account
   - Create a new project

2. **Get Connection String**
   - In your Neon dashboard, go to "Connection Details"
   - Copy the connection string
   - It should look like: `postgresql://username:password@hostname/database`

3. **Configure Environment**
   ```env
   # .env.local
   DATABASE_URL="postgresql://username:password@hostname/database"
   ```

### Initialize Database Schema

```bash
# Generate Drizzle migrations
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) View database in Drizzle Studio
npm run db:studio
```

## Step 3: Authentication Setup

### Configure NextAuth.js

1. **Generate Secret Key**
   ```bash
   # Generate a random secret
   openssl rand -base64 32
   ```

2. **Update Environment Variables**
   ```env
   # .env.local
   NEXTAUTH_SECRET="your-generated-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Configure Providers**
   - Email/password authentication is configured by default
   - Additional providers can be added in `lib/auth/config.ts`

## Step 4: Encryption Setup

### Generate Encryption Key

```bash
# Generate a 32-character encryption key
openssl rand -hex 16
```

### Update Environment
```env
# .env.local
ENCRYPTION_KEY="your-32-character-encryption-key"
```

⚠️ **Important**: Keep this key secure and never commit it to version control!

## Step 5: PWA Configuration

### Service Worker Setup

The PWA configuration is already set up in `next.config.ts`. The app will automatically:
- Generate a service worker
- Cache app shell and API responses
- Enable offline functionality
- Provide install prompts

### Manifest Configuration

The app manifest is configured in `public/manifest.json` and includes:
- App name and description
- Icons for different screen sizes
- Display modes and themes
- Installation preferences

## Step 6: Development Server

### Start Development
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### Verify Setup

1. **Database Connection**
   - Check browser console for database connection errors
   - Try creating a new account

2. **Authentication**
   - Register a new account
   - Log in and out
   - Verify session persistence

3. **Offline Functionality**
   - Open DevTools → Application → Service Workers
   - Verify service worker is registered
   - Test offline mode (DevTools → Network → Offline)

4. **Encryption**
   - Create a board or note
   - Check database - data should be encrypted
   - Verify decryption works in the UI

## Step 7: Production Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - In Vercel dashboard, add production environment variables
   - Update `NEXTAUTH_URL` to your production domain

### Deploy to Netlify

1. **Build Command**
   ```bash
   npm run build
   ```

2. **Publish Directory**
   ```
   .next
   ```

3. **Environment Variables**
   - Add all environment variables in Netlify dashboard

### Deploy to Railway

1. **Connect Repository**
   - Connect your GitHub repository to Railway

2. **Configure Build**
   - Build command: `npm run build`
   - Start command: `npm start`

3. **Environment Variables**
   - Add all required environment variables

## Step 8: SSL/HTTPS Setup

### For PWA Functionality

PWAs require HTTPS in production. Most hosting platforms provide this automatically:

- **Vercel**: Automatic HTTPS
- **Netlify**: Automatic HTTPS
- **Railway**: Automatic HTTPS

### Custom Domain Setup

1. **Add Domain**
   - In your hosting platform, add your custom domain

2. **Update Environment**
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   ```

3. **Update Database**
   - Update any hardcoded URLs in your database

## Step 9: Testing

### Automated Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Manual Testing Checklist

#### Authentication
- [ ] User registration works
- [ ] User login works
- [ ] Password reset works
- [ ] Session persistence works
- [ ] Logout works

#### Core Features
- [ ] Create/edit/delete boards
- [ ] Create/edit/delete lists
- [ ] Create/edit/delete cards
- [ ] Create/edit/delete tasks
- [ ] Create/edit/delete notes
- [ ] Drag and drop functionality

#### Offline Functionality
- [ ] App works offline
- [ ] Data syncs when online
- [ ] Conflicts are resolved
- [ ] Service worker caches properly

#### Security
- [ ] Data is encrypted in database
- [ ] Passwords are hashed
- [ ] Authentication is secure
- [ ] No sensitive data in logs

#### Performance
- [ ] App loads quickly
- [ ] Offline sync is efficient
- [ ] No memory leaks
- [ ] Good Core Web Vitals scores

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check connection string format
echo $DATABASE_URL

# Test connection
npm run db:studio
```

#### Authentication Issues
```bash
# Check NextAuth configuration
npm run dev
# Look for auth-related errors in console
```

#### PWA Not Installing
- Ensure HTTPS is enabled
- Check manifest.json is accessible
- Verify service worker is registered

#### Encryption Errors
- Verify ENCRYPTION_KEY is exactly 32 characters
- Clear browser storage if switching keys
- Check Web Crypto API support

### Debug Mode

Enable debug logging:
```env
# .env.local
DEBUG=true
NODE_ENV=development
```

### Database Debugging

View database in Drizzle Studio:
```bash
npm run db:studio
```

## Next Steps

After successful setup:

1. **Customize UI**: Modify colors, fonts, and layout
2. **Add Features**: Implement additional functionality
3. **Optimize Performance**: Profile and optimize slow queries
4. **Add Tests**: Write comprehensive test coverage
5. **Deploy Updates**: Set up CI/CD pipeline

## Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the [architecture documentation](ARCHITECTURE.md)
3. Search existing [GitHub issues](https://github.com/your-repo/issues)
4. Create a new issue with detailed information

---

Your Minimind app is now ready for production deployment! 🚀
