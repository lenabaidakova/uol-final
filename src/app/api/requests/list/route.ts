export const dynamic = 'force-dynamic';

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
    const userRole = session.user.role;

    const { searchParams = new Map() } = new URL(request.url);

    // get page and limit from query parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { message: 'Must be positive integers' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // filters
    const typeName = searchParams.get('type');
    const urgencyName = searchParams.get('urgency');
    const statusName = searchParams.get('status');

    let typeId, urgencyId, statusId;
    if (typeName) {
      const typeRecord = await prisma.requestType.findUnique({
        where: { name: typeName },
        select: { id: true },
      });
      typeId = typeRecord?.id;
    }
    if (urgencyName) {
      const urgencyRecord = await prisma.requestUrgency.findUnique({
        where: { name: urgencyName },
        select: { id: true },
      });
      urgencyId = urgencyRecord?.id;
    }
    if (statusName) {
      const statusRecord = await prisma.requestStatus.findUnique({
        where: { name: statusName },
        select: { id: true },
      });
      statusId = statusRecord?.id;
    }

    // build where condition
    const where = {
      ...(typeId && { typeId }),
      ...(urgencyId && { urgencyId }),
      ...(statusId && { statusId }),
      ...(searchParams.get('location') && {
        location: { contains: searchParams.get('location').toLowerCase() },
      }),
      ...(searchParams.get('text') && {
        title: { contains: searchParams.get('text').toLowerCase() },
      }),
      ...((searchParams.get('dueDateStart') ||
        searchParams.get('dueDateEnd')) && {
        dueDate: {
          ...(searchParams.get('dueDateStart') && {
            gte: new Date(searchParams.get('dueDateStart')),
          }),
          ...(searchParams.get('dueDateEnd') && {
            lte: new Date(searchParams.get('dueDateEnd')),
          }),
        },
      }),
      ...((searchParams.get('createdDateStart') ||
        searchParams.get('createdDateEnd')) && {
        createdAt: {
          ...(searchParams.get('createdDateStart') && {
            gte: new Date(searchParams.get('createdDateStart')),
          }),
          ...(searchParams.get('createdDateEnd') && {
            lte: new Date(searchParams.get('createdDateEnd')),
          }),
        },
      }),
    };

    // filter by role
    if (userRole === 'SHELTER') {
      where.creatorId = userId; // shelter sees only their own requests
    } else if (userRole === 'SUPPORTER') {
      where.OR = [
        { status: { name: 'PENDING' } }, // supporters see all pending requests
        { assignedToId: userId }, // and requests they were involved in
      ];
    }

    // fetch requests with filters and pagination
    const [requests, totalRequests] = await Promise.all([
      prisma.request.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // order by most recent
        include: {
          type: { select: { name: true } },
          urgency: { select: { name: true } },
          status: { select: { name: true } },
          creator: { select: { name: true } }, // need to get shelter name
        },
      }),
      prisma.request.count({ where }),
    ]);

    return NextResponse.json({
      requests: requests.map((req) => ({
        id: req.id,
        title: req.title,
        type: req.type.name,
        urgency: req.urgency.name,
        status: req.status.name,
        dueDate: req.dueDate,
        details: req.details,
        location: req.location,
        creatorId: req.creatorId,
        shelterName: req.creator.name,
      })),
      pagination: {
        currentPage: page,
        limit,
        totalRequests,
        totalPages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching paginated requests:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
