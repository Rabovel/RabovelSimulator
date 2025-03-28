// app/watchlist/symbol
"use client";
import { useState } from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MetricCard } from '@/components/MetricCard';

// Sample watchlist data
const watchlistData = [
  { symbol: 'MTNN', last: 250.00, change: 5.00, percentChange: 2.04, volume: 12500, high: 252.50, low: 245.00 },
  { symbol: 'DANGCEM', last: 280.50, change: -3.50, percentChange: -1.23, volume: 8900, high: 284.00, low: 279.00 },
  { symbol: 'ZENITHBANK', last: 30.75, change: 0.25, percentChange: 0.82, volume: 45000, high: 31.00, low: 30.50 },
  { symbol: 'GUARANTY', last: 35.20, change: -0.80, percentChange: -2.22, volume: 38700, high: 36.00, low: 34.80 },
  { symbol: 'AIRTELAFRI', last: 900.00, change: 15.00, percentChange: 1.69, volume: 5600, high: 910.00, low: 885.00 },
  { symbol: 'BUACEMENT', last: 95.50, change: 1.20, percentChange: 1.27, volume: 23400, high: 96.00, low: 94.00 },
];

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState(watchlistData);
  const [searchQuery, setSearchQuery] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol && !watchlist.some(item => item.symbol.toLowerCase() === newSymbol.toLowerCase())) {
      // In a real app, this would fetch real data
      const newItem = {
        symbol: newSymbol.toUpperCase(),
        last: 0.00,
        change: 0.00,
        percentChange: 0.00,
        volume: 0,
        high: 0.00,
        low: 0.00,
      };
      setWatchlist([...watchlist, newItem]);
      setNewSymbol('');
    }
  };

  const handleRemoveSymbol = (symbol: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol));
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredWatchlist = watchlist.filter(item =>
    item.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key as keyof typeof a];
    const bValue = b[key as keyof typeof b];
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedWatchlist.length / itemsPerPage);
  const paginatedWatchlist = sortedWatchlist.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Watchlist</title>
        <meta name="description" content="Monitor your tracked securities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Watchlist Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Tracked Symbols" value={watchlist.length.toString()} />
            <MetricCard 
              title="Avg. Daily Change" 
              value={`${(watchlist.reduce((sum, item) => sum + item.percentChange, 0) / watchlist.length || 0).toFixed(2)}%`}
            />
            <MetricCard 
              title="Total Volume" 
              value={watchlist.reduce((sum, item) => sum + item.volume, 0).toLocaleString()}
            />
            <MetricCard 
              title="Day's Gainers" 
              value={watchlist.filter(item => item.change > 0).length.toString()}
            />
          </div>

          {/* Watchlist Controls */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <form onSubmit={handleAddSymbol} className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value)}
                  placeholder="Add symbol (e.g., MTNN)"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Add to Watchlist
                </button>
              </form>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search watchlist..."
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Watchlist Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    {[
                      { label: 'Symbol', key: 'symbol' },
                      { label: 'Last', key: 'last' },
                      { label: 'Change', key: 'change' },
                      { label: '% Change', key: 'percentChange' },
                      { label: 'Volume', key: 'volume' },
                      { label: 'High', key: 'high' },
                      { label: 'Low', key: 'low' },
                      { label: 'Actions', key: '' },
                    ].map((header) => (
                      <th
                        key={header.key}
                        onClick={() => header.key && handleSort(header.key)}
                        className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer ${
                          header.key === '' ? 'cursor-default' : 'hover:text-gray-700'
                        }`}
                      >
                        {header.label}
                        {sortConfig?.key === header.key && (
                          <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedWatchlist.map((item) => (
                    <tr key={item.symbol} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.symbol}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${item.last.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-sm ${
                        item.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 text-sm ${
                        item.percentChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.percentChange >= 0 ? '+' : ''}{item.percentChange.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.volume.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${item.high.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${item.low.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleRemoveSymbol(item.symbol)}
                          className="text-red-600 hover:underline text-xs"
                        >
                          Remove
                        </button>
                        <button className="text-blue-600 hover:underline text-xs ml-2">Chart</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedWatchlist.length)} 
                of {sortedWatchlist.length} symbols
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100 disabled:hover:bg-transparent"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-100 disabled:hover:bg-transparent"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}