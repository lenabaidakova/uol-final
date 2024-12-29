import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role, name } = body;

    // check required fields
    if (!email || !password || !role || !name) {
      return NextResponse.json(
        { message: 'Email, password, name, and role are required fields' },
        { status: 400 }
      );
    }

    if (role !== 'SUPPORTER' && role !== 'SHELTER') {
      return NextResponse.json(
        { message: 'Role should be supporter or shelter' },
        { status: 400 }
      );
    }

    // check if email exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email is already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name,
        verified: false,
        confirmationToken,
      },
    });

    const transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
    });

    const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/registration/confirmation?token=${confirmationToken}`;
    await transporter.sendMail({
      from: 'no-reply@shelterconnect.com',
      to: email,
      subject: 'Confirm your email',
      text: `Please confirm your email by clicking the link ${confirmationUrl}`,
      html: `<p>Please confirm your email by clicking the link below:</p><a href="${confirmationUrl}">${confirmationUrl}</a>`,
    });

    return NextResponse.json(
      {
        message:
          'Registration successful. Please check your email to confirm your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
