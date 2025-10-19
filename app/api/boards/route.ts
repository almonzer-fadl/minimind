import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedUser } from '@/lib/auth/middleware';
import { createBoard, getBoards } from '@/app/actions';
import { z } from 'zod';

// Validation schema
const createBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100, 'Board name too long'),
  description: z.string().max(500, 'Description too long').optional(),
});

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      const result = await getBoards(user.id);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to fetch boards' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        boards: result.boards
      });
      
    } catch (error) {
      console.error('Get boards error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      const body = await request.json();
      
      // Validate input
      const validatedData = createBoardSchema.parse(body);
      const { name, description } = validatedData;
      
      // Create board
      const result = await createBoard(user.id, name, description);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to create board' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        message: 'Board created successfully',
        board: result.board
      }, { status: 201 });
      
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
      
      console.error('Create board error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
