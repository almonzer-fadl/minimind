import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedUser } from '@/lib/auth/middleware';
import { updateBoard, deleteBoard } from '@/app/actions';
import { db } from '@/lib/db';
import { boards } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema
const updateBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100, 'Board name too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      const boardId = (await params).id;
      
      // Get board with lists and cards
      const board = await db.query.boards.findFirst({
        where: and(
          eq(boards.id, boardId),
          eq(boards.userId, user.id)
        ),
        with: {
          lists: {
            orderBy: (lists, { asc }) => [asc(lists.position)],
            with: {
              cards: {
                orderBy: (cards, { asc }) => [asc(cards.position)]
              }
            }
          }
        }
      });
      
      if (!board) {
        return NextResponse.json(
          { error: 'Board not found' },
          { status: 404 }
        );
      }
      
      // Note: In a real implementation, you'd decrypt the data here
      // For now, we'll return the encrypted data structure
      return NextResponse.json({
        board
      });
      
    } catch (error) {
      console.error('Get board error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      const boardId = (await params).id;
      const body = await request.json();
      
      // Validate input
      const validatedData = updateBoardSchema.parse(body);
      
      // Check if board exists and belongs to user
      const existingBoard = await db.query.boards.findFirst({
        where: and(
          eq(boards.id, boardId),
          eq(boards.userId, user.id)
        )
      });
      
      if (!existingBoard) {
        return NextResponse.json(
          { error: 'Board not found' },
          { status: 404 }
        );
      }
      
      // Update board
      const result = await updateBoard(boardId, validatedData);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to update board' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        message: 'Board updated successfully',
        board: result.board
      });
      
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
      
      console.error('Update board error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      const boardId = (await params).id;
      
      // Check if board exists and belongs to user
      const existingBoard = await db.query.boards.findFirst({
        where: and(
          eq(boards.id, boardId),
          eq(boards.userId, user.id)
        )
      });
      
      if (!existingBoard) {
        return NextResponse.json(
          { error: 'Board not found' },
          { status: 404 }
        );
      }
      
      // Delete board (cascade delete will handle lists and cards)
      const result = await deleteBoard(boardId);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to delete board' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        message: 'Board deleted successfully'
      });
      
    } catch (error) {
      console.error('Delete board error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
