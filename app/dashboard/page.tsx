import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [propertyCount, tenantCount, openMaintenance, monthlyRevenue] = await Promise.all([
    prisma.property.count(),
    prisma.tenant.count(),
    prisma.maintenanceRequest.count({ where: { status: { not: 'completed' } } }),
    prisma.payment.aggregate({
      where: { status: 'paid' },
      _sum: { amount: true },
    }),
  ]);

  return {
    propertyCount,
    tenantCount,
    openMaintenance,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
  };
}

async function getRecentTenants() {
  return prisma.tenant.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { property: true },
  });
}

async function getRecentMaintenance() {
  return prisma.maintenanceRequest.findMany({
    take: 5,
    orderBy: { createdDate: 'desc' },
    include: { property: true },
  });
}

export default async function Dashboard() {
  const stats = await getStats();
  const recentTenants = await getRecentTenants();
  const recentMaintenance = await getRecentMaintenance();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here&apos;s your property overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
              🏠
            </div>
            <div>
              <p className="text-sm text-gray-500">Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.propertyCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <p className="text-sm text-gray-500">Tenants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tenantCount}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-2xl">
              🔧
            </div>
            <div>
              <p className="text-sm text-gray-500">Open Maintenance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.openMaintenance}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-2xl">
              💰
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <Link href="/properties/new" className="btn btn-primary">
          + Add Property
        </Link>
        <Link href="/tenants/new" className="btn btn-secondary">
          + Add Tenant
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Tenants</h2>
          {recentTenants.length === 0 ? (
            <p className="text-gray-500 text-sm">No tenants yet. Add your first tenant!</p>
          ) : (
            <div className="space-y-3">
              {recentTenants.map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{tenant.name}</p>
                    <p className="text-sm text-gray-500">{tenant.property.address}</p>
                  </div>
                  <span className={`badge ${tenant.rentStatus === 'paid' ? 'badge-success' : tenant.rentStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                    {tenant.rentStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Maintenance</h2>
          {recentMaintenance.length === 0 ? (
            <p className="text-gray-500 text-sm">No maintenance requests yet.</p>
          ) : (
            <div className="space-y-3">
              {recentMaintenance.map((request) => (
                <div key={request.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{request.property.address}</p>
                    <p className="text-sm text-gray-500 truncate max-w-xs">{request.description}</p>
                  </div>
                  <span className={`badge ${request.priority === 'urgent' ? 'badge-danger' : request.priority === 'high' ? 'badge-warning' : 'badge-info'}`}>
                    {request.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
