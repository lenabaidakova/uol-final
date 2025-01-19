import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const validUrgencies = ['HIGH', 'MEDIUM', 'LOW'];
const validTypes = ['SUPPLIES', 'SERVICES', 'VOLUNTEERS'];

export async function POST(request: Request) {
    try {
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
