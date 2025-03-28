"use client";
import { useRouter } from 'next/navigation';

interface PositionItem {
  symbol: string;
  type: string;
  strike: number;
  expiration: string;
  quantity: number;
  entry: number;
  current: number;
  pl: number;
  direction: string;
}

export function PositionRow({ position }: { position: PositionItem }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/positions/${position.symbol}`);
  };

  return (
    <tr className="hover:bg-gray-50 cursor-pointer" onClick={handleClick}>
      <td className="px-3 py-3 text-sm font-medium text-gray-900">{position.symbol}</td>
      <td className="px-3 py-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          position.type === 'CALL' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {position.type}
        </span>
      </td>
      <td className="px-3 py-3 text-sm text-gray-500">{position.strike}</td>
      <td className="px-3 py-3 text-sm text-gray-500">{position.expiration}</td>
      <td className="px-3 py-3 text-sm text-gray-500">{position.quantity}</td>
      <td className="px-3 py-3 text-sm text-gray-500">{position.entry.toFixed(2)}</td>
      <td className="px-3 py-3 text-sm text-gray-500">{position.current.toFixed(2)}</td>
      <td className={`px-3 py-3 text-sm ${position.direction === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
        {position.direction === 'positive' ? '+' : ''}{`$${Math.abs(position.pl)}`}
      </td>
    </tr>
  );
}