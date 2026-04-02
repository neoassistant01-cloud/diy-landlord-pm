import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { tenants: true, maintenance: true },
  });
  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }
  return NextResponse.json(property);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const property = await prisma.property.update({
      where: { id },
      data: {
        address: body.address,
        type: body.type,
        units: Number(body.units),
        rentAmount: Number(body.rentAmount),
        status: body.status,
      },
    });
    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update property' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 400 });
  }
}
