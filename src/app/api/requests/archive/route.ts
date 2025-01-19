import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request) {
    try {
        const { id } = await request.json();

        // validate request
        if (!id) {
            return NextResponse.json(
                { message: 'Request ID is required' },
                { status: 400 }
            );
        }

        // update status
        const updatedRequest = await prisma.request.update({
            where: { id },
            data: { status: 'ARCHIVED' },
        });

        return NextResponse.json(
            { message: 'Request archived successfully', request: updatedRequest },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error archiving request:', error);

        // handle not found
        if (error.code === 'P2025') {
            return NextResponse.json(
                { message: 'Request not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
