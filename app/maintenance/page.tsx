import Link from 'next/link';
import prisma from '@/lib/prisma';
import { DeleteMaintenanceButton } from '@/app/components/DeleteMaintenanceButton';
import { UpdateMaintenanceStatus } from '@/app/components/UpdateMaintenanceStatus';

export const dynamic = 'force-dynamic';

async function getMaintenanceRequests(search?: string, status?: string, priority?: string) {
  const where: any = {};
  
  if (search) {
    where.OR = [
      { description: { contains: search } },
      { property: { address: { contains: search } } }
    ];
  }
  
  if (status && status !== 'all') {
    where.status = status;
  }
  
  if (priority && priority !== 'all') {
    where.priority = priority;
  }

  return prisma.maintenanceRequest.findMany({
    where,
    orderBy: { createdDate: 'desc' },
    include: { property: true },
  });
}

async function getProperties() {
  return prisma.property.findMany({ orderBy: { address: 'asc' } });
}

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; priority?: string }>;
}) {
  const { search, status, priority } = await searchParams;
  const requests = await getMaintenanceRequests(search, status, priority);
  const properties = await getProperties();
  const propertyMap = new Map(properties.map(p => [p.id, p.address]));

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
          <p className="text-gray-500">Track and manage maintenance issues</p>
        </div>
        <Link href="/maintenance/new" className="btn btn-primary">
          + Add Request
        </Link>
      </div>

      {/* Filters */}
      <form className="mb-6">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            name="search"
            defaultValue={search || ''}
            placeholder="Search description or property..."
            className="input flex-1 min-w-[200px]"
          />
          <select name="status" defaultValue={status || 'all'} className="input w-auto">
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select name="priority" defaultValue={priority || 'all'} className="input w-auto">
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button type="submit" className="btn btn-secondary">Filter</button>
          {(search || status || priority) && (
            <Link href="/maintenance" className="btn btn-secondary">Clear</Link>
          )}
        </div>
      </form>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { key: 'open', label: 'Open', color: 'badge-warning' },
          { key: 'in-progress', label: 'In Progress', color: 'badge-info' },
          { key: 'completed', label: 'Completed', color: 'badge-success' },
          { key: 'urgent', label: 'Urgent', color: 'badge-danger' }
        ].map(s => {
          const count = requests.filter(r => 
            s.key === 'urgent' ? r.priority === 'urgent' : r.status === s.key
          ).length;
          return (
            <div key={s.key} className="card py-3 px-4">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-gray-900">{count}</p>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {search || status || priority ? 'No requests found matching your filters.' : 'No maintenance requests yet.'}
            </p>
            <Link href="/maintenance/new" className="btn btn-primary">+ Add Request</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="table-header">
                <tr>
                  <th className="px-4 py-3 text-left">Property</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-center">Quick Action</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="table-row">
                    <td className="px-4 py-3 font-medium text-gray-900">{propertyMap.get(request.propertyId) || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{request.description}</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-info capitalize">{request.category || 'N/A'}</span>
                    </td>
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
                    <td className="px-4 py-3 text-center">
                      <UpdateMaintenanceStatus id={request.id} currentStatus={request.status} />
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
        
        {requests.length > 0 && (
          <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500">
            Showing {requests.length} request{requests.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
