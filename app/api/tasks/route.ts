import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedUser } from '@/lib/auth/middleware';
import { createTask, getTasksByUser } from '@/app/actions';
import { z } from 'zod';

// Validation schema
const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  priority: z.number().int().min(0).max(2).default(0), // 0: low, 1: medium, 2: high
  dueDate: z.string().datetime().optional(),
});

export async function GET(request: NextRequest) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      const result = await getTasksByUser(user.id);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to fetch tasks' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        tasks: result.tasks
      });
      
    } catch (error) {
      console.error('Get tasks error:', error);
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
      const validatedData = createTaskSchema.parse(body);
      const { title, description, priority } = validatedData;
      
      // Create task
      const result = await createTask(
        user.id, 
        title, 
        description, 
        priority
      );
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to create task' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        message: 'Task created successfully',
        task: result.task
      }, { status: 201 });
      
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
      
      console.error('Create task error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
