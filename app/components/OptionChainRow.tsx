"use client";
import { useRouter } from 'next/navigation';

interface OptionChainItem {
  callBid: number;
  callAsk: number;
  callLast: number;
  callVolume: number;
  strike: number;
  putBid: number;
  putAsk: number;
  putLast: number;
  putVolume: number;
  highlighted: boolean;
}

export function OptionChainRow({ row }: { row: OptionChainItem }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/option-chain/${row.strike}`);
  };

  return (
    <tr className={row.highlighted ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' : 'hover:bg-gray-50 cursor-pointer'} onClick={handleClick}>
      <td className="px-3 py-3 text-sm text-gray-500">{row.callBid.toFixed(2)}</td>
      <td className="px-3 py-3 text-sm text-gray-500">{row.callAsk.toFixed(2)}</td>
      <td className="px-3 py-3 text-sm text-gray-500">{row.callLast.toFixed(2)}</td>
      <td className="px-3 py-3 text-sm text-gray-500">{row.callVolume.toLocaleString()}</td>
      <td className={`px-3 py-3 text-center font-semibold ${row.highlighted ? 'text-blue-600' : 'text-gray-900'}`}>
        {row.strike.toFixed(2)}
      </td>
      <td className="px-3 py-3 text-sm text-gray-500">{row.putBid.toFixed(2)}</td>
      <td className="px-3 py-3 text-sm text-gray-500">{row.putAsk.toFixed(2)}</td>
      <td className="px-3 py-3 text-sm text-gray-500">{row.putLast.toFixed(2)}</td>
      <td className="px-3 py-3 text-sm text-gray-500">{row.putVolume.toLocaleString()}</td>
    </tr>
  );
}