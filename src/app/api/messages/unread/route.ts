import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);

    // get page and limit from query parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // validate page and limit
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { message: 'Must be positive integers' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // fetch unread messages
    const unreadMessages = await prisma.unreadMessage.findMany({
      where: { userId },
      include: {
        message: {
          include: {
            request: true,
            sender: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' }, // order by most recent
      skip,
      take: limit,
    });

    // group messages by request
    const unreadRequests = unreadMessages.reduce(
      (acc, unread) => {
        const { request, sender, createdAt } = unread.message;
        const existing = acc.find((r) => r.requestId === request.id);

        if (existing) {
          existing.unreadCount += 1;
        } else {
          acc.push({
            requestId: request.id,
            title: request.title,
            lastMessageFrom: sender.name,
            lastMessageDate: createdAt,
            unreadCount: 1,
          });
        }
        return acc;
      },
      [] as {
        requestId: string;
        title: string;
        lastMessageFrom: string;
        lastMessageDate: Date;
        unreadCount: number;
      }[]
    );

    // total amount of messages
    const totalUnread = await prisma.unreadMessage.count({ where: { userId } });

    return NextResponse.json({
      unreadRequests,
      pagination: {
        currentPage: page,
        limit,
        totalUnread,
        totalPages: Math.ceil(totalUnread / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
