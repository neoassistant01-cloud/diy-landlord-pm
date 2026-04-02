import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: 'desc' },
    include: { property: true },
  });
  return NextResponse.json(tenants);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tenant = await prisma.tenant.create({
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
    return NextResponse.json(tenant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 400 });
  }
}
