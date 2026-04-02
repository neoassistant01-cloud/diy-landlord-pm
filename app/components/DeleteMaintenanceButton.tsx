'use client';

export function DeleteMaintenanceButton({ id }: { id: string }) {
  return (
    <form action={`/api/maintenance/${id}`} method="DELETE" className="inline">
      <button 
        type="submit" 
        className="text-red-600 hover:text-red-800 text-sm font-medium"
        onClick={(e) => {
          if (!confirm('Are you sure you want to delete this request?')) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}
