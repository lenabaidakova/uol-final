import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
    try {
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

        // fetch requests
        const [requests, totalRequests] = await Promise.all([
            prisma.request.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }, // order by most recent
            }),
            prisma.request.count(),
        ]);

        return NextResponse.json({
            requests,
            pagination: {
                currentPage: page,
                limit: limit,
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
