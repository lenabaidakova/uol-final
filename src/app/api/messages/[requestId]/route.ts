import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    // check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { requestId } = params;

    if (!requestId) {
      return NextResponse.json(
        { message: 'Missing requestId' },
        { status: 400 }
      );
    }

    // fetch all messages related to request
    const messages = await prisma.message.findMany({
      where: { requestId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            name: true, // include user name
          },
        },
      },
    });

    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      requestId: msg.requestId,
      senderId: msg.senderId,
      senderName: msg.sender.name,
      text: msg.text,
      createdAt: msg.createdAt,
    }));

    return NextResponse.json({ messages: formattedMessages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
