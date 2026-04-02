'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Properties', href: '/properties', icon: '🏠' },
  { name: 'Tenants', href: '/tenants', icon: '👤' },
  { name: 'Maintenance', href: '/maintenance', icon: '🔧' },
  { name: 'Payments', href: '/payments', icon: '💰' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-primary px-4">DIY Landlord</h1>
        <p className="text-xs text-gray-500 px-4">Property Manager</p>
      </div>
      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'sidebar-link',
                isActive && 'sidebar-link-active'
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
