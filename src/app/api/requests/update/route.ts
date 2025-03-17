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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataToUpdate: Record<string, any> = {};
    for (const field of editableFields) {
      if (updateData[field] !== undefined) {
        dataToUpdate[field] = updateData[field];
      }
    }

    // convert type, urgency, and status IDs
    if (dataToUpdate.type) {
      const typeRecord = await prisma.requestType.findUnique({
        where: { name: dataToUpdate.type },
      });
      if (!typeRecord)
        return NextResponse.json(
          { message: `Invalid request type: ${dataToUpdate.type}` },
          { status: 400 }
        );
      dataToUpdate.typeId = typeRecord.id;
      delete dataToUpdate.type;
    }

    if (dataToUpdate.urgency) {
      const urgencyRecord = await prisma.requestUrgency.findUnique({
        where: { name: dataToUpdate.urgency },
      });
      if (!urgencyRecord)
        return NextResponse.json(
          { message: `Invalid urgency level: ${dataToUpdate.urgency}` },
          { status: 400 }
        );
      dataToUpdate.urgencyId = urgencyRecord.id;
      delete dataToUpdate.urgency;
    }

    if (dataToUpdate.status) {
      const statusRecord = await prisma.requestStatus.findUnique({
        where: { name: dataToUpdate.status },
      });
      if (!statusRecord)
        return NextResponse.json(
          { message: `Invalid request status: ${dataToUpdate.status}` },
          { status: 400 }
        );
      dataToUpdate.statusId = statusRecord.id;
      delete dataToUpdate.status;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
