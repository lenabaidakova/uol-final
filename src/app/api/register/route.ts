import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import { RoleType } from '@/types/RoleType';
import { ROLES } from '@/constants/Role';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { username, password, role } = body;

    if (!username || !password || !role) {
      return NextResponse.json(
        { message: 'Username, password, and role are required fields' },
        { status: 400 }
      );
    }

    if (!Object.values(ROLES).includes(role as RoleType)) {
      return NextResponse.json(
        { message: 'Role should be supporter or shelter' },
        { status: 400 }
      );
    }

    // check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Username is already taken' },
        { status: 400 }
      );
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
