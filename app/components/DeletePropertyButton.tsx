'use client';

export function DeletePropertyButton({ id }: { id: string }) {
  return (
    <form action={`/api/properties/${id}`} method="DELETE" className="inline">
      <button 
        type="submit" 
        className="text-red-600 hover:text-red-800 text-sm font-medium"
        onClick={(e) => {
          if (!confirm('Are you sure you want to delete this property?')) {
            e.preventDefault();
          }
        }}
      >
        Delete
      </button>
    </form>
  );
}
