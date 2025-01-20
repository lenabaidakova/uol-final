import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();

    // validate request
    if (!id) {
      return NextResponse.json(
        { message: 'Request ID is required' },
        { status: 400 }
      );
    }

    const existingRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { message: 'Request not found' },
        { status: 404 }
      );
    }

    // check if owner
    if (existingRequest.creatorId !== session.user.id) {
      return NextResponse.json(
        {
          message:
            'Forbidden: You do not have permission to update this request',
        },
        { status: 403 }
      );
    }

    // filter editable fields
    const editableFields = [
      'title',
      'type',
      'urgency',
      'dueDate',
      'details',
      'location',
      'status',
    ];
    const dataToUpdate: Record<string, any> = {};
    for (const field of editableFields) {
      if (updateData[field] !== undefined) {
        dataToUpdate[field] = updateData[field];
      }
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return NextResponse.json(
        { message: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.request.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(
      { message: 'Request updated successfully', request: updatedRequest },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating request:', error);

    // handle not found errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
