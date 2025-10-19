# Deployment Guide

This guide covers deploying Minimind to various hosting platforms with different configurations.

## Prerequisites

Before deploying, ensure you have:

1. **Neon Database** set up and configured
2. **Environment variables** ready
3. **Domain name** (optional, but recommended for PWA)
4. **SSL certificate** (required for PWA functionality)

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest option for Next.js applications with excellent PWA support.

#### Setup Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to your project → Settings → Environment Variables
   - Add the following variables:
     ```
     DATABASE_URL=postgresql://username:password@hostname/database
     NEXTAUTH_SECRET=your-secret-key
     NEXTAUTH_URL=https://your-domain.vercel.app
     ENCRYPTION_KEY=your-32-character-encryption-key
     ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

#### Advantages
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments from Git
- ✅ Edge functions support
- ✅ Excellent PWA support

#### Configuration
```json
// vercel.json (optional)
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

### 2. Netlify

Netlify offers excellent static site hosting with serverless functions.

#### Setup Steps

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `.netlify/functions`

2. **Environment Variables**
   Add in Netlify dashboard → Site settings → Environment variables:
   ```
   DATABASE_URL=postgresql://username:password@hostname/database
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-domain.netlify.app
   ENCRYPTION_KEY=your-32-character-encryption-key
   ```

3. **Deploy**
   ```bash
   npm run build
   # Upload .next folder to Netlify
   ```

#### Configuration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### 3. Railway

Railway provides full-stack deployment with database hosting.

#### Setup Steps

1. **Connect Repository**
   - Connect your GitHub repository to Railway
   - Railway will auto-detect Next.js

2. **Configure Environment**
   ```
   DATABASE_URL=postgresql://username:password@hostname/database
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.railway.app
   ENCRYPTION_KEY=your-32-character-encryption-key
   ```

3. **Deploy**
   Railway automatically deploys on git push to main branch.

#### Advantages
- ✅ Full-stack hosting
- ✅ Built-in PostgreSQL
- ✅ Automatic SSL
- ✅ Easy scaling

### 4. Self-Hosted (Docker)

For complete control, deploy using Docker.

#### Dockerfile
```dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://username:password@db:5432/mytrello
      - NEXTAUTH_SECRET=your-secret-key
      - NEXTAUTH_URL=http://localhost:3000
      - ENCRYPTION_KEY=your-32-character-encryption-key
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=mytrello
      - POSTGRES_USER=username
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
```

## Environment Variables

### Required Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@hostname/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Encryption
ENCRYPTION_KEY="your-32-character-encryption-key"

# Optional
NODE_ENV="production"
DEBUG="false"
```

### Generating Secrets

```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate encryption key
openssl rand -hex 16
```

## Database Setup

### 1. Create Database Schema

```bash
# Generate migrations
npm run db:generate

# Push to database
npm run db:push
```

### 2. Verify Connection

```bash
# Open Drizzle Studio
npm run db:studio
```

## SSL/HTTPS Configuration

### For PWA Functionality

PWAs require HTTPS. Most hosting platforms provide this automatically:

- **Vercel**: Automatic HTTPS
- **Netlify**: Automatic HTTPS  
- **Railway**: Automatic HTTPS

### Custom SSL (Self-hosted)

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## PWA Configuration

### Manifest Configuration

Ensure your `public/manifest.json` is properly configured:

```json
{
  "name": "MyTrello - Productivity Suite",
  "short_name": "MyTrello",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff"
}
```

### Service Worker

The service worker is automatically generated by next-pwa. Verify it's working:

1. Open browser DevTools
2. Go to Application → Service Workers
3. Verify service worker is registered
4. Test offline functionality

## Performance Optimization

### 1. Image Optimization

```javascript
// next.config.ts
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

### 2. Bundle Analysis

```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

### 3. Caching Headers

```javascript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60',
          },
        ],
      },
    ]
  },
}
```

## Monitoring and Analytics

### 1. Error Tracking

```bash
npm install @sentry/nextjs
```

### 2. Performance Monitoring

```bash
npm install @vercel/analytics
```

### 3. Health Checks

Create a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'healthy', timestamp: new Date().toISOString() });
}
```

## Troubleshooting

### Common Issues

1. **PWA not installing**
   - Ensure HTTPS is enabled
   - Check manifest.json accessibility
   - Verify service worker registration

2. **Database connection errors**
   - Verify DATABASE_URL format
   - Check IP whitelisting in Neon dashboard
   - Ensure SSL is enabled

3. **Authentication issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches deployment URL
   - Ensure database schema is up to date

4. **Encryption errors**
   - Verify ENCRYPTION_KEY is exactly 32 characters
   - Check for key changes between deployments
   - Clear browser storage if needed

### Debug Mode

Enable debug logging in production:

```bash
DEBUG=true NODE_ENV=production npm start
```

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database credentials protected
- [ ] Encryption keys properly managed
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] SQL injection protection
- [ ] XSS protection enabled

## Backup Strategy

### Database Backups

```bash
# Create backup
pg_dump $DATABASE_URL > backup.sql

# Restore backup
psql $DATABASE_URL < backup.sql
```

### Automated Backups

Set up automated backups in your hosting platform or use external services like:

- Neon automatic backups
- Railway backup snapshots
- AWS RDS automated backups

---

Your Minimind app is now ready for production deployment! 🚀
