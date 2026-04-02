import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getPayment(id: string) {
  return prisma.payment.findUnique({ where: { id } });
}

async function getTenants() {
  return prisma.tenant.findMany({
    orderBy: { name: 'asc' },
    include: { property: true },
  });
}

async function updatePayment(id: string, formData: FormData) {
  'use server';
  
  const tenantId = formData.get('tenantId') as string;
  const amount = Number(formData.get('amount'));
  const date = formData.get('date') as string;
  const dueDate = formData.get('dueDate') as string;
  const method = formData.get('method') as string;
  const status = formData.get('status') as string;

  await prisma.payment.update({
    where: { id },
    data: { 
      tenantId, 
      amount, 
      date: new Date(date), 
      dueDate: new Date(dueDate), 
      method, 
      status 
    },
  });

  redirect('/payments');
}

export default async function EditPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [payment, tenants] = await Promise.all([
    getPayment(id),
    getTenants(),
  ]);

  if (!payment) {
    return (
      <div>
        <p className="text-red-600">Payment not found.</p>
        <a href="/payments" className="btn btn-secondary mt-4">Back to Payments</a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Payment</h1>
        <p className="text-gray-500">Update payment details</p>
      </div>

      <div className="card max-w-2xl">
        <form action={updatePayment.bind(null, id)} className="space-y-6">
          <div>
            <label htmlFor="tenantId" className="label">Tenant *</label>
            <select id="tenantId" name="tenantId" required defaultValue={payment.tenantId} className="input">
              {tenants.map(t => (
                <option key={t.id} value={t.id}>{t.name} - {t.property.address}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="label">Amount *</label>
              <input type="number" id="amount" name="amount" required min="0" step="0.01" defaultValue={payment.amount} className="input" />
            </div>
            <div>
              <label htmlFor="date" className="label">Date *</label>
              <input type="date" id="date" name="date" required defaultValue={new Date(payment.date).toISOString().split('T')[0]} className="input" />
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="label">Due Date *</label>
            <input 
              type="date" 
              id="dueDate" 
              name="dueDate" 
              required 
              defaultValue={payment.dueDate ? new Date(payment.dueDate).toISOString().split('T')[0] : ''} 
              className="input" 
            />
            <p className="text-xs text-gray-500 mt-1">Rent is due on this date</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="method" className="label">Method *</label>
              <select id="method" name="method" required defaultValue={payment.method} className="input">
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="credit-card">Credit Card</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="label">Status *</label>
              <select id="status" name="status" required defaultValue={payment.status} className="input">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn btn-primary">Update Payment</button>
            <a href="/payments" className="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
}
