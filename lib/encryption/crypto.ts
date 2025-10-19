// Modern Web Crypto API implementation for better security
export class EncryptionManager {
  private static instance: EncryptionManager;
  private keyCache: Map<string, CryptoKey> = new Map();

  private constructor() {}

  public static getInstance(): EncryptionManager {
    if (!EncryptionManager.instance) {
      EncryptionManager.instance = new EncryptionManager();
    }
    return EncryptionManager.instance;
  }

  // Generate a random salt
  public generateSalt(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Derive encryption key from password using PBKDF2
  public async deriveKey(password: string, salt: string): Promise<CryptoKey> {
    const cacheKey = `${password}-${salt}`;
    
    if (this.keyCache.has(cacheKey)) {
      return this.keyCache.get(cacheKey)!;
    }

    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );

    this.keyCache.set(cacheKey, derivedKey);
    return derivedKey;
  }

  // Encrypt data using AES-GCM
  public async encrypt(data: string, password: string, salt: string): Promise<string> {
    try {
      const key = await this.deriveKey(password, salt);
      const encoder = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(data)
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt data using AES-GCM
  public async decrypt(encryptedData: string, password: string, salt: string): Promise<string> {
    try {
      const key = await this.deriveKey(password, salt);
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );

      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Generate a secure encryption key for user data
  public generateUserKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Hash password for storage
  public async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Clear key cache for security
  public clearCache(): void {
    this.keyCache.clear();
  }
}

// Convenience functions using the EncryptionManager
export const encryptionManager = EncryptionManager.getInstance();

// Encrypt data for database storage
export async function encryptForStorage(data: string, password: string): Promise<{ encrypted: string; salt: string }> {
  const salt = encryptionManager.generateSalt();
  const encrypted = await encryptionManager.encrypt(data, password, salt);
  
  return {
    encrypted,
    salt,
  };
}

// Decrypt data from database storage
export async function decryptFromStorage(encryptedData: string, password: string, salt: string): Promise<string> {
  return await encryptionManager.decrypt(encryptedData, password, salt);
}

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  return await encryptionManager.hashPassword(password);
}

// Verify password (for compatibility with existing auth)
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await encryptionManager.hashPassword(password);
  return hashedInput === hashedPassword;
}

// Generate encryption key for user data
export function generateEncryptionKey(): string {
  return encryptionManager.generateUserKey();
}

// Encrypt user data with derived key
export async function encryptUserData(data: string, password: string, salt: string): Promise<string> {
  return await encryptionManager.encrypt(data, password, salt);
}

// Decrypt user data with derived key
export async function decryptUserData(encryptedData: string, password: string, salt: string): Promise<string> {
  return await encryptionManager.decrypt(encryptedData, password, salt);
}

// Legacy compatibility functions
export function encryptData(data: string, key: string): string {
  throw new Error('Use encryptUserData instead');
}

export function decryptData(encryptedData: string, key: string): string {
  throw new Error('Use decryptUserData instead');
}

export function generateSalt(): string {
  return encryptionManager.generateSalt();
}

export async function deriveKeyFromPassword(password: string, salt: string): Promise<any> {
  throw new Error('Use encryptionManager.deriveKey instead');
}
