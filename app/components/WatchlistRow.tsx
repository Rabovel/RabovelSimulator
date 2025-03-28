"use client";
import { useRouter } from 'next/navigation';

interface WatchlistItem {
  symbol: string;
  last: number;
  change: number;
  percentChange: number;
  direction: string;
}

export function WatchlistRow({ item }: { item: WatchlistItem }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/watchlist/${item.symbol}`);
  };

  return (
    <tr className="hover:bg-gray-50 cursor-pointer" onClick={handleClick}>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.symbol}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{item.last.toFixed(2)}</td>
      <td className={`px-4 py-3 text-sm ${item.direction === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
        {item.direction === 'positive' ? '+' : ''}{item.change.toFixed(2)} ({item.percentChange.toFixed(2)}%)
      </td>
    </tr>
  );
}