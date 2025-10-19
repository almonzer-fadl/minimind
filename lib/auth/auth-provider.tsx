"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { EncryptionManager } from '@/lib/encryption/crypto';

interface User {
  id: string;
  email: string;
  name?: string;
  encryptionKeyHash?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  encryptData: (data: string) => Promise<string>;
  decryptData: (encryptedData: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [encryptionManager, setEncryptionManager] = useState<EncryptionManager | null>(null);

  // Initialize encryption manager when user logs in
  useEffect(() => {
    if (session?.user && typeof window !== 'undefined') {
      const manager = EncryptionManager.getInstance();
      setEncryptionManager(manager);
      setUser({
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name,
        encryptionKeyHash: (session.user as any).encryptionKeyHash,
      });
    } else {
      setUser(null);
      setEncryptionManager(null);
    }
    setIsLoading(false);
  }, [session]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Refresh the session to get updated user data
        window.location.href = '/dashboard';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // Clear encryption manager
      setEncryptionManager(null);
      setUser(null);
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword: password, name }),
      });

      if (response.ok) {
        // Refresh the session to get updated user data
        window.location.href = '/dashboard';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const encryptData = async (data: string): Promise<string> => {
    if (!encryptionManager) {
      throw new Error('Encryption manager not initialized');
    }
    return await encryptionManager.encryptUserData(data);
  };

  const decryptData = async (encryptedData: string): Promise<string> => {
    if (!encryptionManager) {
      throw new Error('Encryption manager not initialized');
    }
    return await encryptionManager.decryptUserData(encryptedData);
  };

  const value: AuthContextType = {
    user,
    isLoading: isLoading || status === 'loading',
    isAuthenticated: !!session?.user,
    login,
    logout,
    register,
    encryptData,
    decryptData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Auth Guard Component
interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-body">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Redirect to sign-in page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/signin';
    }
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-body">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
