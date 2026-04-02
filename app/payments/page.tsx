import Link from 'next/link';
import prisma from '@/lib/prisma';
import { DeletePaymentButton } from '@/app/components/DeletePaymentButton';

export const dynamic = 'force-dynamic';

async function getPayments() {
  return prisma.payment.findMany({
    orderBy: { date: 'desc' },
    include: { tenant: { include: { property: true } } },
  });
}

export default async function PaymentsPage() {
  const payments = await getPayments();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500">Track rent payments</p>
        </div>
        <Link href="/payments/new" className="btn btn-primary">
          + Add Payment
        </Link>
      </div>

      <div className="card overflow-hidden">
        {payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No payments yet.</p>
            <Link href="/payments/new" className="btn btn-primary">
              + Add Payment
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 text-left">Tenant</th>
                  <th className="px-4 py-3 text-left">Property</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Method</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="table-row">
                    <td className="px-4 py-3 font-medium text-gray-900">{payment.tenant.name}</td>
                    <td className="px-4 py-3 text-gray-600">{payment.tenant.property.address}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">${payment.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{payment.method}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        payment.status === 'paid' ? 'badge-success' :
                        payment.status === 'pending' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/payments/${payment.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</Link>
                        <DeletePaymentButton id={payment.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
