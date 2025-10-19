import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthenticatedUser } from '@/lib/auth/middleware';
import { updateTask, deleteTask } from '@/app/actions';
import { db } from '@/lib/db';
import { tasks } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

// Validation schema
const updateTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  completed: z.boolean().optional(),
  priority: z.number().int().min(0).max(2).optional(),
  dueDate: z.string().datetime().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      const taskId = params.id;
      
      // Get task
      const task = await db.query.tasks.findFirst({
        where: and(
          eq(tasks.id, taskId),
          eq(tasks.userId, user.id)
        )
      });
      
      if (!task) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
      
      // Note: In a real implementation, you'd decrypt the data here
      return NextResponse.json({
        task
      });
      
    } catch (error) {
      console.error('Get task error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      const taskId = params.id;
      const body = await request.json();
      
      // Validate input
      const validatedData = updateTaskSchema.parse(body);
      
      // Check if task exists and belongs to user
      const existingTask = await db.query.tasks.findFirst({
        where: and(
          eq(tasks.id, taskId),
          eq(tasks.userId, user.id)
        )
      });
      
      if (!existingTask) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
      
      // Prepare update data
      const updateData: any = {};
      if (validatedData.title !== undefined) updateData.title = validatedData.title;
      if (validatedData.description !== undefined) updateData.description = validatedData.description;
      if (validatedData.completed !== undefined) updateData.completed = validatedData.completed;
      if (validatedData.priority !== undefined) updateData.priority = validatedData.priority;
      if (validatedData.dueDate !== undefined) updateData.dueDate = validatedData.dueDate ? new Date(validatedData.dueDate) : null;
      
      // Update task
      const result = await updateTask(taskId, updateData);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to update task' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        message: 'Task updated successfully',
        task: result.task
      });
      
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
      
      console.error('Update task error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req, user: AuthenticatedUser) => {
    try {
      const taskId = params.id;
      
      // Check if task exists and belongs to user
      const existingTask = await db.query.tasks.findFirst({
        where: and(
          eq(tasks.id, taskId),
          eq(tasks.userId, user.id)
        )
      });
      
      if (!existingTask) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
      
      // Delete task
      const result = await deleteTask(taskId);
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Failed to delete task' },
          { status: 400 }
        );
      }
      
      return NextResponse.json({
        message: 'Task deleted successfully'
      });
      
    } catch (error) {
      console.error('Delete task error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  });
}
