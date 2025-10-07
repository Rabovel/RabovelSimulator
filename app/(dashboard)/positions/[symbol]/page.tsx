// app/positions/[symbol]/page.tsx
"use client";
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';

export default function PositionDetail() {
  const { symbol } = useParams();
  const router = useRouter();

  // Example data
  const position = {
    symbol,
    type: 'CALL',
    strike: 260,
    expiration: 'Mar 21',
    quantity: 10,
    entry: 5.00,
    current: 6.50,
    pl: 1500,
    direction: 'positive'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{`${symbol} - Position Detail`}</title>
        <meta name="description" content={`Position details for ${symbol}`} />
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-4">{symbol} Position Details</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <p>Type: {position.type}</p>
          <p>Strike: {position.strike}</p>
          <p>Expiration: {position.expiration}</p>
          <p>Quantity: {position.quantity}</p>
          <p>Entry: {position.entry.toFixed(2)}</p>
          <p>Current: {position.current.toFixed(2)}</p>
          <p className={position.direction === 'positive' ? 'text-green-500' : 'text-red-500'}>
            P/L: {position.direction === 'positive' ? '+' : ''}${Math.abs(position.pl)}
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
