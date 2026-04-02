import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { id },
    include: { property: true, payments: true },
  });
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }
  return NextResponse.json(tenant);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        leaseStart: new Date(body.leaseStart),
        leaseEnd: new Date(body.leaseEnd),
        unitAssigned: body.unitAssigned,
        rentStatus: body.rentStatus,
        propertyId: body.propertyId,
      },
    });
    return NextResponse.json(tenant);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update tenant' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.tenant.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete tenant' }, { status: 400 });
  }
}
