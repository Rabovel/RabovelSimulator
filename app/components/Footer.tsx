// app/components/Footer.tsx
"use client";
import { useRouter } from 'next/navigation';
import { Home, ListOrdered, Wallet } from 'lucide-react';

export function Footer() {
  const router = useRouter();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Orders', path: '/orders', icon: <ListOrdered className="w-5 h-5" /> },
    { name: 'Funds', path: '/funds', icon: <Wallet className="w-5 h-5" /> },
  ];

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600 p-2"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs">{item.name}</span>
          </button>
        ))}
      </div>
    </footer>
  );
}