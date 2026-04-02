'use client';

import { useRouter } from 'next/navigation';

interface UpdateMaintenanceStatusProps {
  id: string;
  currentStatus: string;
}

export function UpdateMaintenanceStatus({ id, currentStatus }: UpdateMaintenanceStatusProps) {
  const router = useRouter();
  
  const nextStatus = {
    'open': 'in-progress',
    'in-progress': 'completed',
    'completed': 'open',
  } as const;
  
  const statusLabels = {
    'open': 'Start Work',
    'in-progress': 'Complete',
    'completed': 'Reopen',
  };
  
  const buttonClass = {
    'open': 'text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700',
    'in-progress': 'text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700',
    'completed': 'text-xs bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600',
  };
  
  const handleStatusUpdate = async () => {
    const newStatus = nextStatus[currentStatus as keyof typeof nextStatus];
    if (!newStatus) return;
    
    try {
      const response = await fetch(`/api/maintenance/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };
  
  if (currentStatus === 'cancelled') return null;
  
  return (
    <button
      onClick={handleStatusUpdate}
      className={buttonClass[currentStatus as keyof typeof buttonClass]}
    >
      {statusLabels[currentStatus as keyof typeof statusLabels]}
    </button>
  );
}
