import Link from 'next/link';
import prisma from '@/lib/prisma';
import { DeleteTenantButton } from '@/app/components/DeleteTenantButton';

export const dynamic = 'force-dynamic';

async function getTenants(search?: string) {
  const where = search ? {
    OR: [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { property: { address: { contains: search } } }
    ]
  } : {};

  return prisma.tenant.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { property: true },
  });
}

async function getProperties() {
  return prisma.property.findMany({ orderBy: { address: 'asc' } });
}

export default async function TenantsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const tenants = await getTenants(search);
  const properties = await getProperties();
  const propertyMap = new Map(properties.map(p => [p.id, p.address]));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-500">Manage your tenants</p>
        </div>
        <Link href="/tenants/new" className="btn btn-primary">
          + Add Tenant
        </Link>
      </div>

      {/* Search */}
      <form className="mb-6">
        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            name="search"
            defaultValue={search || ''}
            placeholder="Search by name, email, phone, or property..."
            className="input flex-1"
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
          {search && (
            <Link href="/tenants" className="btn btn-secondary">
              Clear
            </Link>
          )}
        </div>
      </form>

      <div className="card overflow-hidden">
        {tenants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {search ? 'No tenants found matching your search.' : 'No tenants yet. Add your first tenant!'}
            </p>
            {!search && (
              <Link href="/tenants/new" className="btn btn-primary">
                + Add Tenant
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Property</th>
                  <th className="px-4 py-3 text-left">Unit</th>
                  <th className="px-4 py-3 text-left">Lease Dates</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="table-row">
                    <td className="px-4 py-3 font-medium text-gray-900">{tenant.name}</td>
                    <td className="px-4 py-3 text-gray-600">{tenant.email}</td>
                    <td className="px-4 py-3 text-gray-600">{tenant.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{propertyMap.get(tenant.propertyId) || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600">{tenant.unitAssigned}</td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        tenant.rentStatus === 'paid' ? 'badge-success' :
                        tenant.rentStatus === 'pending' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {tenant.rentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link 
                          href={`/tenants/portal?tenantId=${tenant.id}`}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Portal
                        </Link>
                        <Link 
                          href={`/tenants/${tenant.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <DeleteTenantButton id={tenant.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {tenants.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500">
            Showing {tenants.length} tenant{tenants.length !== 1 ? 's' : ''}
            {search && ` matching "${search}"`}
          </div>
        )}
      </div>
    </div>
  );
}
