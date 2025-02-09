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

    const tokenData = await prisma.userConfirmationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tokenData || tokenData.user.verified) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: tokenData.user.id },
      data: { verified: true },
    });

    // remove used token
    await prisma.userConfirmationToken.delete({
      where: { token },
    });

    return NextResponse.json(
      { message: 'Email confirmed successfully! You can now log in.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error confirming email:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
