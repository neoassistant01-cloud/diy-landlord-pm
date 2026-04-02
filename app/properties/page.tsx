import Link from 'next/link';
import prisma from '@/lib/prisma';
import { DeletePropertyButton } from '@/app/components/DeletePropertyButton';

export const dynamic = 'force-dynamic';

async function getProperties(search?: string, status?: string) {
  const where: any = {};
  
  if (search) {
    where.OR = [
      { address: { contains: search } },
      { type: { contains: search } }
    ];
  }
  
  if (status && status !== 'all') {
    where.status = status;
  }

  return prisma.property.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { tenants: true },
  });
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  const { search, status } = await searchParams;
  const properties = await getProperties(search, status);

  const statusOptions = ['all', 'active', 'vacant', 'maintenance'];

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500">Manage your rental properties</p>
        </div>
        <Link href="/properties/new" className="btn btn-primary">
          + Add Property
        </Link>
      </div>

      {/* Filters */}
      <form className="mb-6">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            name="search"
            defaultValue={search || ''}
            placeholder="Search by address or type..."
            className="input flex-1 min-w-[200px]"
          />
          <select 
            name="status" 
            defaultValue={status || 'all'}
            className="input w-auto"
          >
            {statusOptions.map(s => (
              <option key={s} value={s}>
                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-secondary">
            Filter
          </button>
          {(search || (status && status !== 'all')) && (
            <Link href="/properties" className="btn btn-secondary">
              Clear
            </Link>
          )}
        </div>
      </form>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {['active', 'vacant', 'maintenance'].map(s => {
          const count = properties.filter(p => p.status === s).length;
          return (
            <div key={s} className="card py-3 px-4">
              <p className="text-xs text-gray-500 capitalize">{s}</p>
              <p className="text-xl font-bold text-gray-900">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {search || status ? 'No properties found matching your filters.' : 'No properties yet. Add your first property!'}
            </p>
            {!search && !status && (
              <Link href="/properties/new" className="btn btn-primary">
                + Add Property
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 text-left">Address</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Units</th>
                  <th className="px-4 py-3 text-left">Rent</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Tenants</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="table-row">
                    <td className="px-4 py-3 font-medium text-gray-900">{property.address}</td>
                    <td className="px-4 py-3 text-gray-600">{property.type}</td>
                    <td className="px-4 py-3 text-gray-600">{property.units}</td>
                    <td className="px-4 py-3 text-gray-600">${property.rentAmount.toLocaleString()}/mo</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        property.status === 'active' ? 'badge-success' :
                        property.status === 'vacant' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <span className={property.tenants.length > 0 ? 'text-green-600' : 'text-gray-400'}>
                        {property.tenants.length}/{property.units}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link 
                          href={`/properties/${property.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <DeletePropertyButton id={property.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {properties.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500">
            Showing {properties.length} property{properties.length !== 1 ? 's' : ''}
            {(search || status) && ` matching filters`}
          </div>
        )}
      </div>
    </div>
  );
}
