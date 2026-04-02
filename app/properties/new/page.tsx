import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function createProperty(formData: FormData) {
  'use server';
  
  const address = formData.get('address') as string;
  const type = formData.get('type') as string;
  const units = Number(formData.get('units'));
  const rentAmount = Number(formData.get('rentAmount'));
  const status = formData.get('status') as string;

  await prisma.property.create({
    data: { address, type, units, rentAmount, status },
  });

  redirect('/properties');
}

export default async function NewPropertyPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Add Property</h1>
        <p className="text-gray-500">Add a new rental property</p>
      </div>

      <div className="card max-w-2xl">
        <form action={createProperty} className="space-y-6">
          <div>
            <label htmlFor="address" className="label">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              required
              className="input"
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          <div>
            <label htmlFor="type" className="label">Property Type *</label>
            <select id="type" name="type" required className="input">
              <option value="">Select type</option>
              <option value="single-family">Single Family</option>
              <option value="multi-family">Multi Family</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="units" className="label">Number of Units *</label>
              <input
                type="number"
                id="units"
                name="units"
                required
                min="1"
                className="input"
                placeholder="1"
              />
            </div>

            <div>
              <label htmlFor="rentAmount" className="label">Monthly Rent *</label>
              <input
                type="number"
                id="rentAmount"
                name="rentAmount"
                required
                min="0"
                step="0.01"
                className="input"
                placeholder="1500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="label">Status *</label>
            <select id="status" name="status" required className="input">
              <option value="active">Active</option>
              <option value="vacant">Vacant</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn btn-primary">
              Add Property
            </button>
            <a href="/properties" className="btn btn-secondary">
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
