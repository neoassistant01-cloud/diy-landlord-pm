import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const maintenance = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: { property: true },
  });
  if (!maintenance) {
    return NextResponse.json({ error: 'Maintenance request not found' }, { status: 404 });
  }
  return NextResponse.json(maintenance);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const maintenance = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        propertyId: body.propertyId,
        description: body.description,
        priority: body.priority,
        status: body.status,
      },
    });
    return NextResponse.json(maintenance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update maintenance request' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.maintenanceRequest.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete maintenance request' }, { status: 400 });
  }
}
