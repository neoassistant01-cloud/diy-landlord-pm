import Link from 'next/link';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getProperty(id: string) {
  return prisma.property.findUnique({
    where: { id },
    include: {
      tenants: true,
      maintenance: {
        orderBy: { createdDate: 'desc' },
        take: 5,
      },
    },
  });
}

export default async function PropertyViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Property Not Found</h1>
        <p className="text-gray-500 mb-4">The property you're looking for doesn't exist.</p>
        <Link href="/properties" className="btn btn-primary">Back to Properties</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <Link href="/properties" className="text-sm text-gray-500 hover:text-gray-700 mb-1 inline-block">
            ← Back to Properties
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{property.address}</h1>
          <p className="text-gray-500 capitalize">{property.type} • {property.units} unit{property.units !== 1 ? 's' : ''}</p>
        </div>
        <Link href={`/properties/${property.id}/edit`} className="btn btn-primary">
          Edit Property
        </Link>
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-500">Monthly Rent</p>
          <p className="text-2xl font-bold text-gray-900">${property.rentAmount.toLocaleString()}/mo</p>
          <p className="text-xs text-gray-400">per unit</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Status</p>
          <span className={`badge ${
            property.status === 'active' ? 'badge-success' :
            property.status === 'vacant' ? 'badge-warning' :
            'badge-danger'
          }`}>
            {property.status}
          </span>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total Units</p>
          <p className="text-2xl font-bold text-gray-900">{property.units}</p>
          <p className="text-xs text-gray-400">{property.tenants.length} occupied</p>
        </div>
      </div>

      {/* Tenants Section */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Tenants ({property.tenants.length})</h2>
          <Link href={`/tenants/new?propertyId=${property.id}`} className="btn btn-secondary text-sm">
            + Add Tenant
          </Link>
        </div>
        
        {property.tenants.length === 0 ? (
          <p className="text-gray-500 text-sm">No tenants yet. Add a tenant to this property!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Unit</th>
                  <th className="px-4 py-2 text-left">Lease Dates</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {property.tenants.map((tenant) => (
                  <tr key={tenant.id} className="table-row">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{tenant.name}</p>
                      <p className="text-xs text-gray-500">{tenant.email}</p>
                    </td>
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
                      <Link href={`/tenants/${tenant.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View/Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Maintenance */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Maintenance</h2>
          <Link href={`/maintenance/new?propertyId=${property.id}`} className="btn btn-secondary text-sm">
            + Add Request
          </Link>
        </div>
        
        {property.maintenance.length === 0 ? (
          <p className="text-gray-500 text-sm">No maintenance requests yet.</p>
        ) : (
          <div className="space-y-3">
            {property.maintenance.map((request) => (
              <div key={request.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{request.description}</p>
                  <p className="text-xs text-gray-500">{new Date(request.createdDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`badge ${
                    request.priority === 'urgent' ? 'badge-danger' :
                    request.priority === 'high' ? 'badge-warning' :
                    request.priority === 'medium' ? 'badge-info' :
                    'badge-success'
                  }`}>
                    {request.priority}
                  </span>
                  <span className={`badge ${
                    request.status === 'completed' ? 'badge-success' :
                    request.status === 'in-progress' ? 'badge-info' :
                    'badge-warning'
                  }`}>
                    {request.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
