'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '📊' },
  { name: 'Properties', href: '/properties', icon: '🏠' },
  { name: 'Tenants', href: '/tenants', icon: '👤' },
  { name: 'Maintenance', href: '/maintenance', icon: '🔧' },
  { name: 'Payments', href: '/payments', icon: '💰' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md"
        aria-label="Toggle menu"
      >
        <span className="text-xl">{isOpen ? '✕' : '☰'}</span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "w-60 bg-white border-r border-gray-200 min-h-screen p-4 fixed lg:static z-40 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="mb-8">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <h1 className="text-xl font-bold text-primary px-4">DIY Landlord</h1>
            <p className="text-xs text-gray-500 px-4">Property Manager</p>
          </Link>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
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
        
        {/* Quick Stats Footer */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-gray-400 text-center">
            <p>DIY Landlord PM v1.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
