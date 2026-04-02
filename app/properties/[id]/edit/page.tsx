import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getProperty(id: string) {
  return prisma.property.findUnique({ where: { id } });
}

async function updateProperty(id: string, formData: FormData) {
  'use server';
  
  const address = formData.get('address') as string;
  const type = formData.get('type') as string;
  const units = Number(formData.get('units'));
  const rentAmount = Number(formData.get('rentAmount'));
  const status = formData.get('status') as string;

  await prisma.property.update({
    where: { id },
    data: { address, type, units, rentAmount, status },
  });

  redirect('/properties');
}

export default async function EditPropertyPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return (
      <div>
        <p className="text-red-600">Property not found.</p>
        <a href="/properties" className="btn btn-secondary mt-4">Back to Properties</a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
        <p className="text-gray-500">Update property details</p>
      </div>

      <div className="card max-w-2xl">
        <form action={updateProperty.bind(null, id)} className="space-y-6">
          <div>
            <label htmlFor="address" className="label">Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              required
              defaultValue={property.address}
              className="input"
            />
          </div>

          <div>
            <label htmlFor="type" className="label">Property Type *</label>
            <select id="type" name="type" required defaultValue={property.type} className="input">
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
                defaultValue={property.units}
                className="input"
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
                defaultValue={property.rentAmount}
                className="input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="status" className="label">Status *</label>
            <select id="status" name="status" required defaultValue={property.status} className="input">
              <option value="active">Active</option>
              <option value="vacant">Vacant</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="btn btn-primary">
              Update Property
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
