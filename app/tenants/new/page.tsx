import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getProperties() {
  return prisma.property.findMany({ orderBy: { address: 'asc' } });
}

async function createTenant(formData: FormData) {
  'use server';
  
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const leaseStart = formData.get('leaseStart') as string;
  const leaseEnd = formData.get('leaseEnd') as string;
  const unitAssigned = formData.get('unitAssigned') as string;
  const rentStatus = formData.get('rentStatus') as string;
  const propertyId = formData.get('propertyId') as string;

  await prisma.tenant.create({
    data: {
      name, email, phone,
      leaseStart: new Date(leaseStart),
      leaseEnd: new Date(leaseEnd),
      unitAssigned, rentStatus, propertyId,
    },
  });

  redirect('/tenants');
}

export default async function NewTenantPage() {
  const properties = await getProperties();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Tenant</h1>
        <p className="text-gray-500">Add a new tenant</p>
      </div>

      <div className="card max-w-2xl">
        <form action={createTenant} className="space-y-6">
          <div>
            <label htmlFor="name" className="label">Full Name *</label>
            <input type="text" id="name" name="name" required className="input" placeholder="John Doe" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="label">Email *</label>
              <input type="email" id="email" name="email" required className="input" placeholder="john@example.com" />
            </div>
            <div>
              <label htmlFor="phone" className="label">Phone *</label>
              <input type="tel" id="phone" name="phone" required className="input" placeholder="(555) 123-4567" />
            </div>
          </div>

          <div>
            <label htmlFor="propertyId" className="label">Property *</label>
            <select id="propertyId" name="propertyId" required className="input">
              <option value="">Select property</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.address}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="unitAssigned" className="label">Unit *</label>
              <input type="text" id="unitAssigned" name="unitAssigned" required className="input" placeholder="1A" />
            </div>
            <div>
              <label htmlFor="rentStatus" className="label">Rent Status *</label>
              <select id="rentStatus" name="rentStatus" required className="input">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="leaseStart" className="label">Lease Start *</label>
              <input type="date" id="leaseStart" name="leaseStart" required className="input" />
            </div>
            <div>
              <label htmlFor="leaseEnd" className="label">Lease End *</label>
              <input type="date" id="leaseEnd" name="leaseEnd" required className="input" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn btn-primary">Add Tenant</button>
            <a href="/tenants" className="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  );
}
