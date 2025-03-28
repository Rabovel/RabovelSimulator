// app/option-chain/strikeprice
"use client";
import { useState } from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Sample option chain data for MTNN
const optionChainData = {
  symbol: 'MTNN',
  lastPrice: 250.00,
  expirationDates: ['Mar 21, 2025', 'Apr 18, 2025', 'May 16, 2025'],
  strikes: [
    {
      strike: 240,
      calls: [
        { expiration: 'Mar 21, 2025', last: 12.50, bid: 12.00, ask: 13.00, volume: 150, oi: 1200 },
        { expiration: 'Apr 18, 2025', last: 15.00, bid: 14.50, ask: 15.50, volume: 80, oi: 800 },
        { expiration: 'May 16, 2025', last: 17.80, bid: 17.20, ask: 18.40, volume: 50, oi: 600 },
      ],
      puts: [
        { expiration: 'Mar 21, 2025', last: 2.30, bid: 2.00, ask: 2.60, volume: 200, oi: 1500 },
        { expiration: 'Apr 18, 2025', last: 3.50, bid: 3.20, ask: 3.80, volume: 120, oi: 1000 },
        { expiration: 'May 16, 2025', last: 4.80, bid: 4.50, ask: 5.10, volume: 90, oi: 700 },
      ],
    },
    {
      strike: 250,
      calls: [
        { expiration: 'Mar 21, 2025', last: 6.50, bid: 6.00, ask: 7.00, volume: 300, oi: 2000 },
        { expiration: 'Apr 18, 2025', last: 9.20, bid: 8.80, ask: 9.60, volume: 150, oi: 1200 },
        { expiration: 'May 16, 2025', last: 12.00, bid: 11.50, ask: 12.50, volume: 100, oi: 900 },
      ],
      puts: [
        { expiration: 'Mar 21, 2025', last: 5.00, bid: 4.70, ask: 5.30, volume: 250, oi: 1800 },
        { expiration: 'Apr 18, 2025', last: 6.80, bid: 6.40, ask: 7.20, volume: 130, oi: 1100 },
        { expiration: 'May 16, 2025', last: 8.50, bid: 8.00, ask: 9.00, volume: 80, oi: 800 },
      ],
    },
    {
      strike: 260,
      calls: [
        { expiration: 'Mar 21, 2025', last: 2.80, bid: 2.50, ask: 3.10, volume: 400, oi: 2500 },
        { expiration: 'Apr 18, 2025', last: 4.50, bid: 4.20, ask: 4.80, volume: 200, oi: 1500 },
        { expiration: 'May 16, 2025', last: 6.70, bid: 6.30, ask: 7.10, volume: 120, oi: 1000 },
      ],
      puts: [
        { expiration: 'Mar 21, 2025', last: 10.20, bid: 9.80, ask: 10.60, volume: 180, oi: 1300 },
        { expiration: 'Apr 18, 2025', last: 12.00, bid: 11.50, ask: 12.50, volume: 100, oi: 900 },
        { expiration: 'May 16, 2025', last: 14.30, bid: 13.80, ask: 14.80, volume: 70, oi: 600 },
      ],
    },
  ],
};

export default function OptionChain() {
  const [selectedSymbol, setSelectedSymbol] = useState('MTNN');
  const [selectedExpiration, setSelectedExpiration] = useState(optionChainData.expirationDates[0]);
  const [viewMode, setViewMode] = useState<'combined' | 'calls' | 'puts'>('combined');

  const filteredStrikes = optionChainData.strikes.map(strike => ({
    strike: strike.strike,
    call: strike.calls.find(c => c.expiration === selectedExpiration)!,
    put: strike.puts.find(p => p.expiration === selectedExpiration)!,
  }));

  const handleTrade = (type: 'call' | 'put', strike: number) => {
    // In a real app, this would open a trading modal or redirect to a trading page
    console.log(`Trade ${type} at strike ${strike} for ${selectedSymbol} expiring ${selectedExpiration}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Option Chain</title>
        <meta name="description" content="View and trade options chains" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header and Controls */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {optionChainData.symbol} Option Chain
                </h1>
                <p className="text-sm text-gray-600">Last Price: ${optionChainData.lastPrice.toFixed(2)}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="MTNN">MTNN</option>
                  {/* Add more symbols here */}
                </select>
                <select
                  value={selectedExpiration}
                  onChange={(e) => setSelectedExpiration(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {optionChainData.expirationDates.map(date => (
                    <option key={date} value={date}>{date}</option>
                  ))}
                </select>
                <div className="flex space-x-2">
                  {['Combined', 'Calls', 'Puts'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode.toLowerCase() as 'combined' | 'calls' | 'puts')}
                      className={`px-3 py-1 text-sm rounded-md ${
                        viewMode === mode.toLowerCase()
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Option Chain Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    {viewMode !== 'puts' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Last</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Bid</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Ask</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Vol</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call OI</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Action</th>
                      </>
                    )}
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-gray-200">Strike</th>
                    {viewMode !== 'calls' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Put Last</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Put Bid</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Put Ask</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Put Vol</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Put OI</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Put Action</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStrikes.map((row) => (
                    <tr key={row.strike} className="hover:bg-gray-50">
                      {viewMode !== 'puts' && (
                        <>
                          <td className="px-4 py-3 text-sm text-gray-900">${row.call.last.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">${row.call.bid.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">${row.call.ask.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.call.volume.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.call.oi.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleTrade('call', row.strike)}
                              className="text-blue-600 hover:underline text-xs"
                            >
                              Trade
                            </button>
                          </td>
                        </>
                      )}
                      <td className="px-4 py-3 text-sm text-gray-900 text-center bg-gray-100 font-medium">
                        ${row.strike.toFixed(2)}
                      </td>
                      {viewMode !== 'calls' && (
                        <>
                          <td className="px-4 py-3 text-sm text-gray-900">${row.put.last.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">${row.put.bid.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">${row.put.ask.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.put.volume.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{row.put.oi.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleTrade('put', row.strike)}
                              className="text-blue-600 hover:underline text-xs"
                            >
                              Trade
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Options Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Call Volume</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredStrikes.reduce((sum, row) => sum + row.call.volume, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Put Volume</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredStrikes.reduce((sum, row) => sum + row.put.volume, 0).toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Put/Call Ratio</p>
                <p className="text-lg font-semibold text-gray-900">
                  {(
                    filteredStrikes.reduce((sum, row) => sum + row.put.volume, 0) /
                    filteredStrikes.reduce((sum, row) => sum + row.call.volume, 0) || 0
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}