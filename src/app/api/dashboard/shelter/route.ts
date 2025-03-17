export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { subMonths, startOfMonth, format } from 'date-fns';

export async function GET() {
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
        { message: 'Only shelters can access dashboard' },
        { status: 403 }
      );
    }

    // shelter can see only their own data
    const shelterId = session.user.id;

    // fetch active requests (PENDING or IN_PROGRESS)
    const activeRequests = await prisma.request.count({
      where: {
        creatorId: shelterId,
        status: { name: { in: ['PENDING', 'IN_PROGRESS'] } },
      },
    });

    // fetch fulfilled requests
    const fulfilledRequests = await prisma.request.count({
      where: { creatorId: shelterId, status: { name: 'COMPLETED' } },
    });

    // fetch unread messages
    const unreadMessages = await prisma.unreadMessage.count({
      where: { request: { creatorId: shelterId } },
    });

    // fetch 10 most recent requests that changed to in progress
    const recentRequests = await prisma.request.findMany({
      where: { creatorId: shelterId, status: { name: 'IN_PROGRESS' } },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        assignedTo: { select: { name: true } },
        updatedAt: true,
      },
    });

    // 12 months range
    const months = Array.from({ length: 12 }).map((_, i) =>
      format(startOfMonth(subMonths(new Date(), 11 - i)), 'yyyy-MM')
    );

    // fetch created requests for last 12 moths
    const createdRequests = await prisma.request.groupBy({
      by: ['createdAt'],
      where: {
        creatorId: shelterId,
        createdAt: { gte: subMonths(new Date(), 11) },
      },
      _count: { _all: true },
    });

    // fetch fulfilled requests for last 12 moths
    const fulfilledRequestsByMonth = await prisma.request.groupBy({
      by: ['updatedAt'],
      where: {
        creatorId: shelterId,
        status: { name: 'COMPLETED' },
        updatedAt: { gte: subMonths(new Date(), 11) },
      },
      _count: { _all: true },
    });

    // format stats output
    const stats = months.map((month) => ({
      month,
      created: createdRequests.reduce(
        (total, c) =>
          format(c.createdAt, 'yyyy-MM') === month
            ? total + c._count._all
            : total,
        0
      ),
      fulfilled: fulfilledRequestsByMonth.reduce(
        (total, f) =>
          format(f.updatedAt, 'yyyy-MM') === month
            ? total + f._count._all
            : total,
        0
      ),
    }));

    return NextResponse.json({
      activeRequests,
      fulfilledRequests,
      unreadMessages,
      recentRequests,
      stats,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
