import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getProperties() {
  return prisma.property.findMany({ orderBy: { address: 'asc' } });
}

async function createMaintenance(formData: FormData) {
  'use server';
  
  const propertyId = formData.get('propertyId') as string;
  const description = formData.get('description') as string;
  const priority = formData.get('priority') as string;
  const status = formData.get('status') as string;

  await prisma.maintenanceRequest.create({
    data: { propertyId, description, priority, status, createdDate: new Date() },
  });

  redirect('/maintenance');
}

export default async function NewMaintenancePage() {
  const properties = await getProperties();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Maintenance Request</h1>
        <p className="text-gray-500">Create a new maintenance request</p>
      </div>

      <div className="card max-w-2xl">
        <form action={createMaintenance} className="space-y-6">
          <div>
            <label htmlFor="propertyId" className="label">Property *</label>
            <select id="propertyId" name="propertyId" required className="input">
              <option value="">Select property</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.address}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="label">Description *</label>
            <textarea id="description" name="description" required rows={3} className="input" placeholder="Describe the issue..."></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="label">Priority *</label>
              <select id="priority" name="priority" required className="input">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="label">Status *</label>
              <select id="status" name="status" required className="input">
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn btn-primary">Add Request</button>
            <a href="/maintenance" className="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
}
