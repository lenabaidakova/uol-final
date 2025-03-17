import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // get session
    const session = await getServerSession(authOptions);

    // check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // validate role
    if (session.user.role !== 'SHELTER') {
      return NextResponse.json(
        { message: 'Only users with the SHELTER role can create requests' },
        { status: 403 }
      );
    }

    const { title, type, urgency, dueDate, details, location } =
      await request.json();

    // validate required fields
    if (!title || !type || !urgency || !details || !location) {
      return NextResponse.json(
        { message: 'All fields are required except dueDate' },
        { status: 400 }
      );
    }

    // validate urgency and type and status
    const typeRecord = await prisma.requestType.findUnique({
      where: { name: type },
    });

    const urgencyRecord = await prisma.requestUrgency.findUnique({
      where: { name: urgency },
    });

    const statusRecord = await prisma.requestStatus.findUnique({
      where: { name: 'PENDING' },
    });

    if (!typeRecord) {
      return NextResponse.json(
        { message: `Invalid request type: ${type}` },
        { status: 400 }
      );
    }

    if (!urgencyRecord) {
      return NextResponse.json(
        { message: `Invalid urgency level: ${urgency}` },
        { status: 400 }
      );
    }

    if (!statusRecord) {
      return NextResponse.json(
        { message: 'System error: Status PENDING not found' },
        { status: 500 }
      );
    }

    // create request
    const newRequest = await prisma.request.create({
      data: {
        title,
        typeId: typeRecord.id,
        urgencyId: urgencyRecord.id,
        statusId: statusRecord.id, // add default PENDING status
        dueDate: dueDate ? new Date(dueDate) : null,
        details,
        location,
        creatorId: session.user.id,
      },
    });

    return NextResponse.json(
      { message: 'Request created successfully', request: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating request:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
