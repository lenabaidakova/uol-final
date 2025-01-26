import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // get page and limit from query parameters
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // filters
    const urgency = searchParams.get('urgency') || undefined;
    const location = searchParams.get('location') || undefined;
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const text = searchParams.get('text') || undefined;
    const dueDateStart = searchParams.get('dueDateStart') || undefined;
    const dueDateEnd = searchParams.get('dueDateEnd') || undefined;
    const createdDateStart = searchParams.get('createdDateStart') || undefined;
    const createdDateEnd = searchParams.get('createdDateEnd') || undefined;

    // validate page and limit
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { message: 'Must be positive integers' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // build where condition
    const where: any = {};
    if (urgency) where.urgency = urgency;
    if (location) where.location = { contains: location.toLowerCase() };
    if (type) where.type = type;
    if (status) where.status = status;
    if (text) where.title = { contains: text.toLowerCase() };
    if (dueDateStart || dueDateEnd) {
      where.dueDate = {};
      if (dueDateStart) where.dueDate.gte = new Date(dueDateStart);
      if (dueDateEnd) where.dueDate.lte = new Date(dueDateEnd);
    }
    if (createdDateStart || createdDateEnd) {
      where.createdAt = {};
      if (createdDateStart) where.createdAt.gte = new Date(createdDateStart);
      if (createdDateEnd) where.createdAt.lte = new Date(createdDateEnd);
    }

    // fetch requests with filters and pagination
    const [requests, totalRequests] = await Promise.all([
      prisma.request.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // order by most recent
      }),
      prisma.request.count({ where }),
    ]);

    return NextResponse.json({
      requests,
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
