import CryptoJS from 'crypto-js';

// Encryption key derivation from user password
export async function deriveKeyFromPassword(password: string, salt: string): Promise<CryptoJS.lib.WordArray> {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32, // 256 bits
    iterations: 10000,
  });
}

// Generate random salt
export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128 / 8).toString();
}

// Encrypt data using AES-256-GCM
export function encryptData(data: string, key: string): string {
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.GCM,
    padding: CryptoJS.pad.NoPadding,
  });
  
  // Combine IV and encrypted data
  return iv.concat(encrypted.ciphertext).toString(CryptoJS.enc.Base64);
}

// Decrypt data using AES-256-GCM
export function decryptData(encryptedData: string, key: string): string {
  const cipherParams = CryptoJS.enc.Base64.parse(encryptedData);
  const iv = CryptoJS.lib.WordArray.create(cipherParams.words.slice(0, 4));
  const ciphertext = CryptoJS.lib.WordArray.create(cipherParams.words.slice(4));
  
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: ciphertext } as any,
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.NoPadding,
    }
  );
  
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Encrypt data for database storage
export async function encryptForStorage(data: string, password: string): Promise<{ encrypted: string; salt: string }> {
  const salt = generateSalt();
  const key = await deriveKeyFromPassword(password, salt);
  const encrypted = encryptData(data, key.toString());
  
  return {
    encrypted,
    salt,
  };
}

// Decrypt data from database storage
export async function decryptFromStorage(encryptedData: string, password: string, salt: string): Promise<string> {
  const key = await deriveKeyFromPassword(password, salt);
  return decryptData(encryptedData, key.toString());
}

// Hash password for storage
export async function hashPassword(password: string): Promise<string> {
  const salt = generateSalt();
  const hashed = await deriveKeyFromPassword(password, salt);
  return `${salt}:${hashed.toString()}`;
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const [salt, hash] = hashedPassword.split(':');
  const derivedKey = await deriveKeyFromPassword(password, salt);
  return derivedKey.toString() === hash;
}

// Generate encryption key for user data
export function generateEncryptionKey(): string {
  return CryptoJS.lib.WordArray.random(256 / 8).toString();
}

// Encrypt user data with derived key
export function encryptUserData(data: string, encryptionKey: string): string {
  return encryptData(data, encryptionKey);
}

// Decrypt user data with derived key
export function decryptUserData(encryptedData: string, encryptionKey: string): string {
  return decryptData(encryptedData, encryptionKey);
}
