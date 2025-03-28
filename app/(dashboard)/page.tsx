// app/dashboard/page.tsx
"use client";
import { useState } from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MetricCard } from '@/components/MetricCard';
import { TableHeader } from '@/components/TableHeader';
import { WatchlistRow } from '@/components/WatchlistRow';
import { PositionRow } from '@/components/PositionRow';
import { CategoryCard } from '@/components/CategoryCard';

// Sample data with additional metrics
const dashboardMetrics = {
  portfolioValue: "$34,782.56",
  dayPL: "+$423.18",
  openPositions: 14,
  buyingPower: "$12,340.00",
  totalPL: "+$2,156.89",
  winRate: "62.5%",
  avgTradeDuration: "3.4 days",
  exposure: "$18,450.00"
};

const watchlistData = [
  { symbol: 'MTNN', last: 250.00, change: 5.00, percentChange: 2.04, direction: 'positive', volume: 12500 },
  { symbol: 'DANGCEM', last: 280.50, change: -3.50, percentChange: -1.23, direction: 'negative', volume: 8900 },
  { symbol: 'ZENITHBANK', last: 30.75, change: 0.25, percentChange: 0.82, direction: 'positive', volume: 45000 },
  { symbol: 'GUARANTY', last: 35.20, change: -0.80, percentChange: -2.22, direction: 'negative', volume: 38700 },
  { symbol: 'AIRTELAFRI', last: 900.00, change: 15.00, percentChange: 1.69, direction: 'positive', volume: 5600 },
];

const positionsData = {
  options: [
    { symbol: 'MTNN', type: 'CALL', strike: 260, expiration: 'Mar 21', quantity: 10, entry: 5.00, current: 6.50, pl: 1500, direction: 'positive' },
    { symbol: 'DANGCEM', type: 'PUT', strike: 270, expiration: 'Apr 18', quantity: 5, entry: 8.00, current: 6.00, pl: -1000, direction: 'negative' },
  ],
  stocks: [
    { symbol: 'ZENITHBANK', quantity: 100, avgPrice: 30.00, current: 30.75, pl: 75, direction: 'positive' },
    { symbol: 'GUARANTY', quantity: 50, avgPrice: 36.00, current: 35.20, pl: -40, direction: 'negative' },
  ],
  history: [
    { symbol: 'MTNN', type: 'CALL', profit: 1200, date: 'Mar 10', status: 'closed' },
    { symbol: 'DANGCEM', type: 'PUT', profit: -450, date: 'Mar 12', status: 'closed' },
  ]
};

const stockCategories = [
  { title: 'Agro Stocks', image: '/agro.png', description: 'Agricultural companies and commodities', category: 'agro' },
  { title: 'Real Estate Stocks', image: '/real-estate.png', description: 'Property development and management', category: 'real-estate' },
  { title: 'Insurance Stocks', image: '/insurance.png', description: 'Insurance providers and services', category: 'insurance' },
  { title: 'Tech Stocks', image: '/tech.png', description: 'Technology and innovation companies', category: 'tech' },
  { title: 'Banking Stocks', image: '/banking.png', description: 'Financial institutions and banks', category: 'banking' },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Options');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFrame, setTimeFrame] = useState('1D');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Filter logic could be added here
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'Options':
        return positionsData.options.map((position, index) => (
          <PositionRow key={index} position={position} />
        ));
      case 'Stocks':
        return positionsData.stocks.map((stock, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-4 py-3">{stock.symbol}</td>
            <td className="px-4 py-3">{stock.quantity}</td>
            <td className="px-4 py-3">${stock.avgPrice}</td>
            <td className="px-4 py-3">${stock.current}</td>
            <td className={`px-4 py-3 ${stock.direction === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
              ${stock.pl}
            </td>
          </tr>
        ));
      case 'History':
        return positionsData.history.map((trade, index) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-4 py-3">{trade.symbol}</td>
            <td className="px-4 py-3">{trade.type}</td>
            <td className={`px-4 py-3 ${trade.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${trade.profit}
            </td>
            <td className="px-4 py-3">{trade.date}</td>
          </tr>
        ));
      default:
        return null;
    }
  };

  const getTableHeaders = () => {
    switch (activeTab) {
      case 'Options':
        return ["Symbol", "Type", "Strike", "Exp.", "Qty", "Entry", "Current", "P/L"];
      case 'Stocks':
        return ["Symbol", "Quantity", "Avg. Price", "Current", "P/L"];
      case 'History':
        return ["Symbol", "Type", "Profit", "Date"];
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Stock Options Dashboard</title>
        <meta name="description" content="Advanced stock options trading platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Enhanced Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Portfolio Value" value={dashboardMetrics.portfolioValue} />
            <MetricCard 
              title="Day P/L" 
              value={dashboardMetrics.dayPL} 
              valueClass={dashboardMetrics.dayPL.startsWith('+') ? 'text-green-500' : 'text-red-500'} 
            />
            <MetricCard title="Open Positions" value={dashboardMetrics.openPositions.toString()} />
            <MetricCard title="Buying Power" value={dashboardMetrics.buyingPower} />
            <MetricCard 
              title="Total P/L" 
              value={dashboardMetrics.totalPL} 
              valueClass={dashboardMetrics.totalPL.startsWith('+') ? 'text-green-500' : 'text-red-500'} 
            />
            <MetricCard title="Win Rate" value={dashboardMetrics.winRate} />
            <MetricCard title="Avg. Duration" value={dashboardMetrics.avgTradeDuration} />
            <MetricCard title="Exposure" value={dashboardMetrics.exposure} />
          </div>

          {/* Watchlist and Positions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Watchlist</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50">
                    + Add
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                    Refresh
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <TableHeader columns={["Symbol", "Last", "Change", "Volume"]} />
                  <tbody className="divide-y divide-gray-200">
                    {watchlistData.map((stock, index) => (
                      <WatchlistRow key={index} item={{...stock, volume: stock.volume}} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <nav className="flex space-x-6 border-b border-gray-200">
                  {['Options', 'Stocks', 'History'].map((tab) => (
                    <button
                      key={tab}
                      className={`py-2 px-1 text-sm font-medium ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
                <div className="flex space-x-2">
                  {activeTab !== 'History' && (
                    <select 
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      value={timeFrame}
                      onChange={(e) => setTimeFrame(e.target.value)}
                    >
                      <option value="1D">1D</option>
                      <option value="1W">1W</option>
                      <option value="1M">1M</option>
                      <option value="ALL">All</option>
                    </select>
                  )}
                  <span className="px-2 py-1 text-xs font-semibold bg-blue-600 text-white rounded-md">
                    {activeTab === 'Options' ? positionsData.options.length : 
                     activeTab === 'Stocks' ? positionsData.stocks.length : 
                     positionsData.history.length} positions
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <TableHeader columns={getTableHeaders()} />
                  <tbody className="divide-y divide-gray-200">
                    {getTabContent()}
                  </tbody>
                </table>
              </div>

              <div className="mt-6">
                <div className="h-64 w-full bg-gray-50 rounded flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500">{activeTab} Performance Chart</p>
                    <p className="text-sm text-gray-400">(Chart visualization would appear here)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Stock Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Explore Stock Categories</h2>
              <button className="px-3 py-1 text-sm text-blue-600 hover:underline">
                View All Categories
              </button>
            </div>
            
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search stocks by symbol or name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stockCategories.map((category) => (
                <CategoryCard
                  key={category.category}
                  title={category.title}
                  image={category.image}
                  description={category.description}
                  category={category.category}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}