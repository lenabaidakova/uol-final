import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Invalid confirmation token' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { confirmationToken: token },
    });

    if (!user || user.verified) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true, confirmationToken: null },
    });

    return NextResponse.json(
      { message: 'Email confirmed successfully! You can now log in.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
