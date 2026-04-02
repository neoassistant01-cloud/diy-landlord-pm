import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { tenant: { include: { property: true } } },
  });
  if (!payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
  }
  return NextResponse.json(payment);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const payment = await prisma.payment.update({
      where: { id },
      data: {
        tenantId: body.tenantId,
        amount: Number(body.amount),
        date: new Date(body.date),
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        method: body.method,
        status: body.status,
      },
    });
    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.payment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete payment' }, { status: 400 });
  }
}
