import prisma from '@/lib/prisma';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getTenantData(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      property: true,
      payments: {
        orderBy: { date: 'desc' },
        take: 20,
      },
    },
  });
  return tenant;
}

async function createMaintenanceRequest(formData: FormData) {
  'use server';
  
  const tenantId = formData.get('tenantId') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as string;
  const category = formData.get('category') as string;
  
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { propertyId: true },
  });
  
  if (tenant) {
    await prisma.maintenanceRequest.create({
      data: {
        propertyId: tenant.propertyId,
        description,
        priority,
        category,
        status: 'pending',
      },
    });
  }
}

export default async function TenantPortalPage({
  searchParams,
}: {
  searchParams: Promise<{ tenantId?: string }>;
}) {
  const { tenantId } = await searchParams;
  
  if (!tenantId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tenant Portal</h1>
          <p className="text-gray-600">No tenant specified. Please use your tenant portal link.</p>
        </div>
      </div>
    );
  }
  
  const tenant = await getTenantData(tenantId);
  
  if (!tenant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tenant Not Found</h1>
          <p className="text-gray-600">The tenant ID provided is not valid.</p>
        </div>
      </div>
    );
  }

  const tenantWithProperty = tenant as typeof tenant & { property: NonNullable<typeof tenant.property> };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Tenant Portal</h1>
          <div className="text-sm text-gray-600">
            Welcome, {tenant.name}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lease & Property Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lease Details */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Lease Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Lease Start</p>
                  <p className="font-medium text-gray-900">
                    {new Date(tenant.leaseStart).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lease End</p>
                  <p className="font-medium text-gray-900">
                    {new Date(tenant.leaseEnd).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Unit</p>
                  <p className="font-medium text-gray-900">{tenant.unitAssigned}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rent Status</p>
                  <span className={`badge ${
                    tenant.rentStatus === 'paid' ? 'badge-success' :
                    tenant.rentStatus === 'pending' ? 'badge-warning' :
                    'badge-danger'
                  }`}>
                    {tenant.rentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Property Details */}
            {tenant.property && (
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Property</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{tenantWithProperty.property.address}</p>
                    <p className="text-sm text-gray-500">{tenantWithProperty.property.type} • {tenantWithProperty.property.units} unit{tenantWithProperty.property.units !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Monthly Rent</p>
                    <p className="text-xl font-bold text-gray-900">${tenantWithProperty.property.rentAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Payment History */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
              {tenant.payments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No payment history yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="table-header">
                      <tr>
                        <th className="px-3 py-2 text-left text-sm">Date</th>
                        <th className="px-3 py-2 text-left text-sm">Amount</th>
                        <th className="px-3 py-2 text-left text-sm">Method</th>
                        <th className="px-3 py-2 text-left text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenant.payments.map((payment) => (
                        <tr key={payment.id} className="table-row">
                          <td className="px-3 py-2 text-sm text-gray-600">
                            {new Date(payment.date).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-2 text-sm font-medium text-gray-900">
                            ${payment.amount.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-600 capitalize">
                            {payment.method}
                          </td>
                          <td className="px-3 py-2">
                            <span className={`badge ${
                              payment.status === 'completed' ? 'badge-success' :
                              payment.status === 'pending' ? 'badge-warning' :
                              'badge-danger'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Maintenance Request Form */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Submit Maintenance Request</h2>
              <form action={createMaintenanceRequest} className="space-y-4">
                <input type="hidden" name="tenantId" value={tenantId} />
                
                <div>
                  <label className="label">Category</label>
                  <select name="category" className="input" required>
                    <option value="">Select category...</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="hvac">HVAC/Heating</option>
                    <option value="appliance">Appliance</option>
                    <option value="structural">Structural</option>
                    <option value="pest">Pest Control</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="label">Priority</label>
                  <select name="priority" className="input" required>
                    <option value="">Select priority...</option>
                    <option value="low">Low - Non-urgent</option>
                    <option value="medium">Medium - Needs attention</option>
                    <option value="high">High - Urgent</option>
                    <option value="emergency">Emergency - Immediate</option>
                  </select>
                </div>

                <div>
                  <label className="label">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    className="input"
                    placeholder="Please describe the issue in detail..."
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  Submit Request
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-600">{tenant.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
