import Link from 'next/link';
import prisma from '@/lib/prisma';
import { DeleteMaintenanceButton } from '@/app/components/DeleteMaintenanceButton';

export const dynamic = 'force-dynamic';

async function getMaintenanceRequests() {
  return prisma.maintenanceRequest.findMany({
    orderBy: { createdDate: 'desc' },
    include: { property: true },
  });
}

async function getProperties() {
  return prisma.property.findMany({ orderBy: { address: 'asc' } });
}

export default async function MaintenancePage() {
  const requests = await getMaintenanceRequests();
  const properties = await getProperties();
  const propertyMap = new Map(properties.map(p => [p.id, p.address]));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-500">Track and manage maintenance issues</p>
        </div>
        <Link href="/maintenance/new" className="btn btn-primary">
          + Add Request
        </Link>
      </div>

      <div className="card overflow-hidden">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No maintenance requests yet.</p>
            <Link href="/maintenance/new" className="btn btn-primary">
              + Add Request
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 text-left">Property</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="table-row">
                    <td className="px-4 py-3 font-medium text-gray-900">{propertyMap.get(request.propertyId) || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{request.description}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        request.priority === 'urgent' ? 'badge-danger' :
                        request.priority === 'high' ? 'badge-warning' :
                        request.priority === 'medium' ? 'badge-info' :
                        'badge-success'
                      }`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        request.status === 'completed' ? 'badge-success' :
                        request.status === 'in-progress' ? 'badge-info' :
                        request.status === 'cancelled' ? 'badge-danger' :
                        'badge-warning'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {new Date(request.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/maintenance/${request.id}/edit`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</Link>
                        <DeleteMaintenanceButton id={request.id} />
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
