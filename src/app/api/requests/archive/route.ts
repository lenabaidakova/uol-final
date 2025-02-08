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

    const { id } = await request.json();

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
            'Forbidden: You do not have permission to archive this request',
        },
        { status: 403 }
      );
    }

    const archivedStatus = await prisma.requestStatus.findUnique({
      where: { name: 'ARCHIVED' },
    });

    if (!archivedStatus) {
      return NextResponse.json(
        { message: 'ARCHIVED status not found' },
        { status: 500 }
      );
    }

    // archive request
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: { statusId: archivedStatus.id },
    });

    return NextResponse.json(
      { message: 'Request archived successfully', request: updatedRequest },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error archiving request:', error);

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
