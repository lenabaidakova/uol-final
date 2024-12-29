import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, newName } = await request.json();

    if (!userId || !newName) {
      return NextResponse.json(
        { message: 'User ID and new name are required' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: newName },
    });

    return NextResponse.json(
      {
        message: 'Updated successfully',
        user: updatedUser,
        refreshSession: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user name:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
