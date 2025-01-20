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
    });

    if (!requestItem) {
      return NextResponse.json(
        { message: 'Request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ request: requestItem });
  } catch (error) {
    console.error('Error fetching request by ID:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
