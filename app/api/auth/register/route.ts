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
    console.log('Registration request received');
    const body = await request.json();
    console.log('Request body:', body);
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    const { email, password } = validatedData;
    console.log('Validated data:', { email, password: '***' });
    
    // Check if user already exists
    console.log('Checking if user exists...');
    const existingUser = await checkUserExists(email);
    console.log('Existing user check result:', existingUser);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create user
    console.log('Creating user...');
    const result = await createUser(email, password);
    console.log('Create user result:', result);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to create user' },
        { status: 400 }
      );
    }
    
    if (!result.user) {
      return NextResponse.json(
        { error: 'User creation failed' },
        { status: 500 }
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
          details: error.issues
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
  try {
    console.log('checkUserExists: Starting database query...');
    const { neon } = await import('@neondatabase/serverless');
    
    console.log('checkUserExists: Database imports successful');
    // Use raw SQL approach to avoid Drizzle query issues
    const sql = neon(process.env.DATABASE_URL!);
    const userResult = await sql`
      SELECT id, email, password_hash, encryption_key_hash, created_at, updated_at 
      FROM users 
      WHERE email = ${email}
      LIMIT 1
    `;
    console.log('checkUserExists: Query successful, result:', userResult);
    
    return userResult.length > 0 ? userResult[0] : null;
  } catch (error) {
    console.error('checkUserExists error:', error);
    throw error;
  }
}
