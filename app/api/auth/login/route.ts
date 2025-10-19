import { NextRequest, NextResponse } from 'next/server';
import { verifyUser } from '@/app/actions';
import { z } from 'zod';
import { SignJWT } from 'jose';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;
    
    // Verify user credentials
    const result = await verifyUser(email, password);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Authentication failed' },
        { status: 401 }
      );
    }
    
    // Create JWT token
    const token = await createJWT({
      id: result.user!.id,
      email: result.user!.email,
    });
    
    // Create response with token
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: result.user!.id,
          email: result.user!.email,
        }
      },
      { status: 200 }
    );
    
    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.issues 
        },
        { status: 400 }
      );
    }
    
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createJWT(payload: { id: string; email: string }) {
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}
