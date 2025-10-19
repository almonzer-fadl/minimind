import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/app/actions';
import { z } from 'zod';

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    const { email, password } = validatedData;
    
    // Check if user already exists
    const existingUser = await checkUserExists(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create user
    const result = await createUser(email, password);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create user' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
          createdAt: result.user.createdAt
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function checkUserExists(email: string) {
  const { db } = await import('@/lib/db');
  const { users } = await import('@/lib/db/schema');
  const { eq } = await import('drizzle-orm');
  
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  });
  
  return user;
}
