import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const [
    propertyCount,
    tenantCount,
    openMaintenance,
    totalRevenue,
    monthlyRevenue,
    propertiesByStatus,
    expiringLeases,
    pendingPayments
  ] = await Promise.all([
    prisma.property.count(),
    prisma.tenant.count(),
    prisma.maintenanceRequest.count({ where: { status: { not: 'completed' } } }),
    prisma.payment.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
    prisma.payment.aggregate({ 
      where: { status: 'paid', date: { gte: startOfMonth } }, 
      _sum: { amount: true } 
    }),
    prisma.property.groupBy({ by: ['status'], _count: { id: true } }),
    prisma.tenant.count({ 
      where: { 
        leaseEnd: { 
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          gte: new Date()
        }
      } 
    }),
    prisma.payment.count({ where: { status: 'pending' } })
  ]);

  return {
    propertyCount,
    tenantCount,
    openMaintenance,
    totalRevenue: totalRevenue._sum.amount || 0,
    monthlyRevenue: monthlyRevenue._sum.amount || 0,
    propertiesByStatus,
    expiringLeases,
    pendingPayments,
    occupancyRate: propertyCount > 0 ? Math.round((tenantCount / propertyCount) * 100) : 0
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

async function getRecentPayments() {
  return prisma.payment.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    include: { tenant: { include: { property: true } } },
  });
}

async function getExpiringLeases() {
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  return prisma.tenant.findMany({
    where: {
      leaseEnd: { lte: thirtyDaysFromNow, gte: new Date() }
    },
    take: 5,
    orderBy: { leaseEnd: 'asc' },
    include: { property: true },
  });
}

export default async function Dashboard() {
  const stats = await getStats();
  const recentTenants = await getRecentTenants();
  const recentMaintenance = await getRecentMaintenance();
  const recentPayments = await getRecentPayments();
  const expiringLeases = await getExpiringLeases();

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
              <p className="text-xs text-gray-400">{stats.propertyCount - stats.openMaintenance} active</p>
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
              <p className="text-xs text-gray-400">{stats.occupancyRate}% occupancy</p>
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
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
            📅
          </div>
          <div>
            <p className="text-sm text-gray-500">Expiring Leases</p>
            <p className="text-xl font-bold text-gray-900">{stats.expiringLeases}</p>
            <p className="text-xs text-gray-400">Next 30 days</p>
          </div>
        </div>
        
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-xl">
            ⏳
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Payments</p>
            <p className="text-xl font-bold text-gray-900">{stats.pendingPayments}</p>
            <p className="text-xs text-gray-400">Awaiting payment</p>
          </div>
        </div>
        
        <div className="card flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-xl">
            💵
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-400">All time</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link href="/properties/new" className="btn btn-primary">
          + Add Property
        </Link>
        <Link href="/tenants/new" className="btn btn-secondary">
          + Add Tenant
        </Link>
        <Link href="/maintenance/new" className="btn btn-secondary">
          + Maintenance Request
        </Link>
        <Link href="/payments/new" className="btn btn-secondary">
          + Record Payment
        </Link>
      </div>

      {/* Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Leases Alert */}
        {expiringLeases.length > 0 && (
          <div className="card border-l-4 border-amber-500">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              ⚠️ Expiring Leases
            </h2>
            <div className="space-y-3">
              {expiringLeases.map((tenant) => {
                const daysUntilExpiry = Math.ceil((new Date(tenant.leaseEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={tenant.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{tenant.name}</p>
                      <p className="text-sm text-gray-500">{tenant.property.address} - Unit {tenant.unitAssigned}</p>
                    </div>
                    <span className="badge badge-warning">
                      {daysUntilExpiry} days
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Tenants */}
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
                  <span className={`badge ${
                    request.priority === 'urgent' ? 'badge-danger' : 
                    request.priority === 'high' ? 'badge-warning' : 
                    'badge-info'
                  }`}>
                    {request.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Payments</h2>
          {recentPayments.length === 0 ? (
            <p className="text-gray-500 text-sm">No payments yet.</p>
          ) : (
            <div className="space-y-3">
              {recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{payment.tenant.name}</p>
                    <p className="text-sm text-gray-500">{new Date(payment.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${payment.amount.toLocaleString()}</p>
                    <span className={`badge text-xs ${payment.status === 'paid' ? 'badge-success' : payment.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
