import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tenants: true, maintenance: true },
  });
  return NextResponse.json(properties);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const property = await prisma.property.create({
      data: {
        address: body.address,
        type: body.type,
        units: Number(body.units),
        rentAmount: Number(body.rentAmount),
        status: body.status,
      },
    });
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create property' }, { status: 400 });
  }
}
