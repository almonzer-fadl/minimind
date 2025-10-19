# Architecture Documentation

## Overview

Minimind is built as a Progressive Web App (PWA) with an offline-first architecture, ensuring users can access their data anywhere, anytime, even without an internet connection.

## Core Architecture Principles

### 1. Offline-First Design
- **Primary Storage**: IndexedDB for local data persistence
- **Sync Strategy**: Background synchronization when online
- **Conflict Resolution**: Last-write-wins with user notification for conflicts
- **Service Workers**: Cache app shell and API responses

### 2. Client-Side Encryption
- **Encryption Method**: AES-256-GCM using Web Crypto API
- **Key Derivation**: PBKDF2 from user password
- **Zero-Knowledge**: Server never sees unencrypted data
- **Performance**: Encryption/decryption handled in Web Workers

### 3. Progressive Web App
- **Installable**: Works on iOS, Android, and desktop
- **Responsive**: Adapts to any screen size
- **Fast**: Optimized loading and caching
- **Reliable**: Works offline and in poor network conditions

## Technology Stack

### Frontend Layer
```
┌─────────────────────────────────────┐
│           React Components          │
│  (Next.js App Router + TypeScript) │
├─────────────────────────────────────┤
│           UI Components             │
│  (shadcn/ui + DaisyUI + Tailwind)  │
├─────────────────────────────────────┤
│        State Management             │
│    (TanStack Query + React Query)  │
├─────────────────────────────────────┤
│        Offline Storage              │
│     (IndexedDB + Dexie.js)         │
└─────────────────────────────────────┘
```

### Backend Layer
```
┌─────────────────────────────────────┐
│         API Routes (Next.js)        │
│    (Authentication + CRUD Ops)     │
├─────────────────────────────────────┤
│         Database Layer              │
│    (Drizzle ORM + Neon PostgreSQL) │
├─────────────────────────────────────┤
│        External Services            │
│     (Neon DB + NextAuth.js)        │
└─────────────────────────────────────┘
```

## Data Flow Architecture

### 1. Online Mode
```
User Action → React Component → TanStack Query → API Route → Database
     ↑                                                              ↓
UI Update ← Cache Update ← Response ← Encrypted Data ← Query Result
```

### 2. Offline Mode
```
User Action → React Component → IndexedDB (Local) → Background Queue
     ↑                                                      ↓
UI Update ← Local Cache ← Dexie.js ← Service Worker ← Sync Queue
```

### 3. Sync Process
```
Background Sync → API Routes → Database → Conflict Resolution → Local Update
```

## Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  encryption_key_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Boards
```sql
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name_encrypted BYTEA NOT NULL,
  description_encrypted BYTEA,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Lists
```sql
CREATE TABLE lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name_encrypted BYTEA NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Cards
```sql
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
  title_encrypted BYTEA NOT NULL,
  description_encrypted BYTEA,
  position INTEGER NOT NULL,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Tasks
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title_encrypted BYTEA NOT NULL,
  description_encrypted BYTEA,
  completed BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Notes
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title_encrypted BYTEA NOT NULL,
  content_encrypted BYTEA NOT NULL,
  tags_encrypted BYTEA,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Security Architecture

### Encryption Flow
```
User Password → PBKDF2 → Encryption Key → AES-256-GCM → Encrypted Data
     ↑                                                        ↓
Plain Text ← AES-256-GCM ← Encryption Key ← PBKDF2 ← User Password
```

### Authentication Flow
```
Login → NextAuth.js → bcrypt Verification → JWT Token → Secure Session
```

### Data Protection
- **At Rest**: All sensitive data encrypted in database
- **In Transit**: HTTPS/TLS encryption
- **In Memory**: Encryption keys never persisted
- **Client-Side**: Web Crypto API for secure encryption

## Offline Synchronization

### Sync Strategy
1. **Optimistic Updates**: UI updates immediately
2. **Background Sync**: Changes queued when offline
3. **Conflict Resolution**: Last-write-wins with user notification
4. **Incremental Sync**: Only changed data synchronized

### Conflict Resolution
```typescript
interface ConflictResolution {
  localVersion: number;
  remoteVersion: number;
  lastModified: Date;
  resolution: 'local' | 'remote' | 'merge' | 'manual';
}
```

### Sync States
- **SYNCED**: Local and remote data match
- **PENDING**: Changes queued for sync
- **CONFLICT**: Conflicting changes detected
- **ERROR**: Sync failed, retry needed

## Performance Optimizations

### Caching Strategy
- **App Shell**: Cached via Service Worker
- **API Responses**: Cached with TTL
- **Database Queries**: Optimized with indexes
- **Images/Assets**: CDN with compression

### Bundle Optimization
- **Code Splitting**: Route-based splitting
- **Tree Shaking**: Remove unused code
- **Compression**: Gzip/Brotli compression
- **Lazy Loading**: Load components on demand

## Deployment Architecture

### Development
```
Local Machine → Next.js Dev Server → Neon Database (Development)
```

### Production
```
Vercel/Netlify → Next.js App → Neon Database (Production)
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="..."

# Encryption
ENCRYPTION_KEY="..."

# Feature Flags
ENABLE_PWA=true
ENABLE_OFFLINE=true
```

## Monitoring and Analytics

### Error Tracking
- **Client-Side**: Error boundaries and logging
- **Server-Side**: API error monitoring
- **Database**: Query performance monitoring

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS
- **Offline Performance**: Sync success rates
- **User Experience**: Task completion times

## Future Enhancements

### Planned Features
1. **Real-time Collaboration**: WebSocket connections
2. **Advanced CRDTs**: Conflict-free replicated data types
3. **File Attachments**: Encrypted file storage
4. **Mobile Apps**: React Native versions
5. **API Access**: REST/GraphQL APIs

### Scalability Considerations
- **Database Sharding**: User-based partitioning
- **CDN Integration**: Global asset delivery
- **Caching Layers**: Redis for session storage
- **Load Balancing**: Multiple server instances

---

This architecture ensures Minimind is secure, performant, and provides an excellent user experience across all platforms while maintaining data privacy and offline functionality.
