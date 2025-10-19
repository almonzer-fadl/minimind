import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export async function verifyToken(token: string): Promise<AuthenticatedUser | null> {
  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return {
      id: payload.id as string,
      email: payload.email as string,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function getAuthToken(request: NextRequest): string | null {
  // Try to get token from cookies first
  const cookieToken = request.cookies.get('auth-token')?.value;
  if (cookieToken) {
    return cookieToken;
  }
  
  // Try to get token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
}

export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const token = getAuthToken(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const user = await verifyToken(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    return await handler(request, user);
    
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}

// Middleware for protecting API routes
export function createAuthMiddleware() {
  return async function authMiddleware(
    request: NextRequest,
    handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
  ) {
    return withAuth(request, handler);
  };
}

// Helper to get current user from request
export async function getCurrentUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  const token = getAuthToken(request);
  if (!token) return null;
  
  return await verifyToken(token);
}
