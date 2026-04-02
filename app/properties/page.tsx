import Link from 'next/link';
import prisma from '@/lib/prisma';
import { DeletePropertyButton } from '@/app/components/DeletePropertyButton';

export const dynamic = 'force-dynamic';

async function getProperties() {
  return prisma.property.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tenants: true },
  });
}

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-500">Manage your rental properties</p>
        </div>
        <Link href="/properties/new" className="btn btn-primary">
          + Add Property
        </Link>
      </div>

      <div className="card overflow-hidden">
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No properties yet. Add your first property!</p>
            <Link href="/properties/new" className="btn btn-primary">
              + Add Property
            </Link>
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
                    <td className="px-4 py-3 text-gray-600">${property.rentAmount}/mo</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        property.status === 'active' ? 'badge-success' :
                        property.status === 'vacant' ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{property.tenants.length}</td>
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
      </div>
    </div>
  );
}
