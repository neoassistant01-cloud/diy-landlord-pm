import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const payments = await prisma.payment.findMany({
    orderBy: { date: 'desc' },
    include: { tenant: { include: { property: true } } },
  });
  return NextResponse.json(payments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payment = await prisma.payment.create({
      data: {
        tenantId: body.tenantId,
        amount: Number(body.amount),
        date: new Date(body.date),
        method: body.method,
        status: body.status,
      },
    });
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 400 });
  }
}
