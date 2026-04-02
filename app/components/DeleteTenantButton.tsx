'use client';

export function DeleteTenantButton({ id }: { id: string }) {
  return (
    <form action={`/api/tenants/${id}`} method="DELETE" className="inline">
      <button 
        type="submit" 
        className="text-red-600 hover:text-red-800 text-sm font-medium"
        onClick={(e) => {
          if (!confirm('Are you sure you want to delete this tenant?')) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}
