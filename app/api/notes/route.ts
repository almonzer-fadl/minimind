import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedUser } from '@/lib/auth/middleware';
import { createNote, getNotes } from '@/app/actions';
import { z } from 'zod';

// Validation schema
const createNoteSchema = z.object({
  title: z.string().min(1, 'Note title is required').max(200, 'Note title too long'),
  content: z.string().min(1, 'Note content is required'),
  tags: z.string().max(500, 'Tags too long').optional(),
});

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      const result = await getNotes(user.id);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to fetch notes' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        notes: result.notes
      });
      
    } catch (error) {
      console.error('Get notes error:', error);
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
      const validatedData = createNoteSchema.parse(body);
      const { title, content, tags } = validatedData;
      
      // Create note
      const result = await createNote(user.id, title, content, tags);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to create note' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        message: 'Note created successfully',
        note: result.note
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
      
      console.error('Create note error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
