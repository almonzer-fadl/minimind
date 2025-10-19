import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedUser } from '@/lib/auth/middleware';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      // Get user details from database
      const userDetails = await db.query.users.findFirst({
        where: eq(users.id, user.id),
        columns: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          // Exclude sensitive data
          passwordHash: false,
          encryptionKeyHash: false,
        }
      });
      
      if (!userDetails) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        user: userDetails
      });
      
    } catch (error) {
      console.error('Get user error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(request: NextRequest) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      const body = await request.json();
      const { email } = body;
      
      // Validate email if provided
      if (email && typeof email === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return NextResponse.json(
            { error: 'Invalid email format' },
            { status: 400 }
          );
        }
        
        // Check if email is already taken
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, email)
        });
        
        if (existingUser && existingUser.id !== user.id) {
          return NextResponse.json(
            { error: 'Email already in use' },
            { status: 409 }
          );
        }
      }
      
      // Update user
      const updateData: any = { updatedAt: new Date() };
      if (email) updateData.email = email;
      
      const updatedUser = await db.update(users)
        .set(updateData)
        .where(eq(users.id, user.id))
        .returning({
          id: users.id,
          email: users.email,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        });
      
      return NextResponse.json({
        message: 'User updated successfully',
        user: updatedUser[0]
      });
      
    } catch (error) {
      console.error('Update user error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      // Delete user and all associated data (cascade delete)
      await db.delete(users).where(eq(users.id, user.id));
      
      return NextResponse.json({
        message: 'User account deleted successfully'
      });
      
    } catch (error) {
      console.error('Delete user error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
