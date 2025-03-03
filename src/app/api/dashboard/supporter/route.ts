import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // get session
    const session = await getServerSession(authOptions);

    // check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // validate role
    if (session.user.role !== 'SUPPORTER') {
      return NextResponse.json(
        { message: 'Only supporters can access dashboard' },
        { status: 403 }
      );
    }

    // supporter can see only their own data
    const supporterId = session.user.id;

    // fetch requests in progress
    const requestsInProgress = await prisma.request.count({
      where: {
        assignedToId: supporterId,
        status: { name: 'IN_PROGRESS' },
      },
    });

    // fetch fulfilled requests
    const fulfilledRequests = await prisma.request.count({
      where: {
        assignedToId: supporterId,
        status: { name: 'COMPLETED' },
      },
    });

    // fetch unread messages
    const unreadMessages = await prisma.unreadMessage.count({
      where: {
        userId: supporterId,
      },
    });

    // fetch 10 most recent requests in progress
    const recentRequests = await prisma.request.findMany({
      where: {
        assignedToId: supporterId,
        status: { name: 'IN_PROGRESS' },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        creator: { select: { name: true } },
        dueDate: true,
      },
    });

    // fetch 10 suggested requests (open requests)
    const suggestedRequests = await prisma.request.findMany({
      where: {
        assignedToId: null,
        status: { name: 'PENDING' },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        creator: { select: { name: true } },
        dueDate: true,
      },
    });

    return NextResponse.json({
      requestsInProgress,
      fulfilledRequests,
      unreadMessages,
      recentRequests,
      suggestedRequests,
    });
  } catch (error) {
    console.error('Error fetching supporter dashboard data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
