import { NextResponse } from 'next/server';
import { OpenAPI } from '@/lib/swagger';

export async function GET() {
  return NextResponse.json(OpenAPI);
}
