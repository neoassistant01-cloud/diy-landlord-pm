import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getTenants() {
  return prisma.tenant.findMany({
    orderBy: { name: 'asc' },
    include: { property: true },
  });
}

async function createPayment(formData: FormData) {
  'use server';
  
  const tenantId = formData.get('tenantId') as string;
  const amount = Number(formData.get('amount'));
  const date = formData.get('date') as string;
  const method = formData.get('method') as string;
  const status = formData.get('status') as string;

  await prisma.payment.create({
    data: { tenantId, amount, date: new Date(date), method, status },
  });

  redirect('/payments');
}

export default async function NewPaymentPage() {
  const tenants = await getTenants();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Payment</h1>
        <p className="text-gray-500">Record a new payment</p>
      </div>

      <div className="card max-w-2xl">
        <form action={createPayment} className="space-y-6">
          <div>
            <label htmlFor="tenantId" className="label">Tenant *</label>
            <select id="tenantId" name="tenantId" required className="input">
              <option value="">Select tenant</option>
              {tenants.map(t => (
                <option key={t.id} value={t.id}>{t.name} - {t.property.address}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="label">Amount *</label>
              <input type="number" id="amount" name="amount" required min="0" step="0.01" className="input" placeholder="1500" />
            </div>
            <div>
              <label htmlFor="date" className="label">Date *</label>
              <input type="date" id="date" name="date" required className="input" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="method" className="label">Method *</label>
              <select id="method" name="method" required className="input">
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="credit-card">Credit Card</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="label">Status *</label>
              <select id="status" name="status" required className="input">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn btn-primary">Add Payment</button>
            <a href="/payments" className="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
}
