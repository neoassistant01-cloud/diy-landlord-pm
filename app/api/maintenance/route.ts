import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const requests = await prisma.maintenanceRequest.findMany({
    orderBy: { createdDate: 'desc' },
    include: { property: true },
  });
  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const maintenance = await prisma.maintenanceRequest.create({
      data: {
        propertyId: body.propertyId,
        description: body.description,
        priority: body.priority,
        status: body.status,
        createdDate: new Date(body.createdDate || new Date()),
      },
    });
    return NextResponse.json(maintenance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create maintenance request' }, { status: 400 });
  }
}
