import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

const validUrgencies = ['HIGH', 'MEDIUM', 'LOW'];
const validTypes = ['SUPPLIES', 'SERVICES', 'VOLUNTEERS'];

export async function POST(request: Request) {
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
                { message: 'Only users with the SHELTER role can create requests' },
                { status: 403 }
            );
        }

        const { title, type, urgency, dueDate, details, location } = await request.json();

        // validate required fields
        if (!title || !type || !urgency || !details || !location) {
            return NextResponse.json(
                { message: 'All fields are required except dueDate' },
                { status: 400 }
            );
        }

        // validate urgency and type
        if (!validUrgencies.includes(urgency)) {
            return NextResponse.json(
                { message: `Invalid urgency level. Must be one of: ${validUrgencies.join(', ')}` },
                { status: 400 }
            );
        }

        if (!validTypes.includes(type)) {
            return NextResponse.json(
                { message: `Invalid request type. Must be one of: ${validTypes.join(', ')}` },
                { status: 400 }
            );
        }

        // create request
        const newRequest = await prisma.request.create({
            data: {
                title,
                type,
                urgency,
                dueDate: dueDate ? new Date(dueDate) : null,
                details,
                location,
                creatorId: session.user.id,
            },
        });

        return NextResponse.json(
            { message: 'Request created successfully', request: newRequest },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating request:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
