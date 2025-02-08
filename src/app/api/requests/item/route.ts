import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'Request ID is required' },
        { status: 400 }
      );
    }

    const requestItem = await prisma.request.findUnique({
      where: { id },
      include: {
        type: { select: { name: true } },
        urgency: { select: { name: true } },
        status: { select: { name: true } },
      },
    });

    if (!requestItem) {
      return NextResponse.json(
        { message: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      request: {
        id: requestItem.id,
        title: requestItem.title,
        type: requestItem.type.name,
        urgency: requestItem.urgency.name,
        status: requestItem.status.name,
        dueDate: requestItem.dueDate,
        details: requestItem.details,
        location: requestItem.location,
        creatorId: requestItem.creatorId,
      },
    });
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
