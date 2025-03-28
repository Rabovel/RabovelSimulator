// app/dashboard/orders/page.tsx
"use client";
import { useState } from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MetricCard } from '@/components/MetricCard';

// Sample data
const orderMetrics = {
  openOrders: 8,
  filledToday: 12,
  totalOrders: 156,
  pendingValue: "$3,450.00",
};

const openOrders = [
  { id: 'O1', symbol: 'MTNN', type: 'Buy', quantity: 100, price: 250.50, status: 'Pending', time: '09:15', date: 'Mar 16, 2025' },
  { id: 'O2', symbol: 'DANGCEM', type: 'Sell', quantity: 50, price: 280.00, status: 'Pending', time: '10:30', date: 'Mar 16, 2025' },
  { id: 'O3', symbol: 'ZENITHBANK', type: 'Buy', quantity: 200, price: 30.75, status: 'Partially Filled', time: '11:45', date: 'Mar 16, 2025' },
  { id: 'O4', symbol: 'GUARANTY', type: 'Sell', quantity: 150, price: 35.20, status: 'Pending', time: '13:20', date: 'Mar 16, 2025' },
  { id: 'O5', symbol: 'AIRTELAFRI', type: 'Buy', quantity: 20, price: 900.00, status: 'Pending', time: '14:10', date: 'Mar 16, 2025' },
  { id: 'O6', symbol: 'MTNN', type: 'Sell', quantity: 75, price: 251.00, status: 'Pending', time: '15:00', date: 'Mar 16, 2025' },
];

const orderHistory = [
  { id: 'H1', symbol: 'MTNN', type: 'Buy', quantity: 150, price: 248.00, status: 'Filled', time: '09:30', date: 'Mar 15, 2025' },
  { id: 'H2', symbol: 'DANGCEM', type: 'Sell', quantity: 100, price: 282.50, status: 'Filled', time: '10:45', date: 'Mar 15, 2025' },
  { id: 'H3', symbol: 'ZENITHBANK', type: 'Buy', quantity: 300, price: 30.50, status: 'Cancelled', time: '11:15', date: 'Mar 15, 2025' },
  { id: 'H4', symbol: 'GUARANTY', type: 'Sell', quantity: 200, price: 35.80, status: 'Filled', time: '13:30', date: 'Mar 14, 2025' },
  { id: 'H5', symbol: 'AIRTELAFRI', type: 'Buy', quantity: 30, price: 895.00, status: 'Filled', time: '14:45', date: 'Mar 14, 2025' },
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState('Open');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCancelOrder = (orderId: string) => {
    // Here you would typically make an API call to cancel the order
    console.log(`Cancel order ${orderId}`);
  };

  const getFilteredData = () => {
    const data = activeTab === 'Open' ? openOrders : orderHistory;
    return data.filter(order =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.date.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredData = getFilteredData();
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Order Management</title>
        <meta name="description" content="Manage your trading orders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Order Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Open Orders" value={orderMetrics.openOrders.toString()} />
            <MetricCard title="Filled Today" value={orderMetrics.filledToday.toString()} />
            <MetricCard title="Total Orders" value={orderMetrics.totalOrders.toString()} />
            <MetricCard title="Pending Value" value={orderMetrics.pendingValue} />
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <div className="flex space-x-6 border-b border-gray-200">
                {['Open', 'History'].map((tab) => (
                  <button
                    key={tab}
                    className={`py-2 px-1 text-sm font-medium ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search orders by ID or symbol..."
                className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{order.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{order.symbol}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.type === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {order.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{order.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">${order.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'Filled' ? 'bg-green-100 text-green-800' :
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Partially Filled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{order.time}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{order.date}</td>
                      <td className="px-4 py-3 text-sm">
                        {activeTab === 'Open' && order.status !== 'Filled' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 hover:underline text-xs"
                          >
                            Cancel
                          </button>
                        )}
                        <button className="text-blue-600 hover:underline text-xs ml-2">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} 
                of {filteredData.length} orders
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

          {/* Quick Order Placement */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Place New Order</h2>
            <form className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Symbol</label>
                <input
                  type="text"
                  placeholder="e.g., MTNN"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600">
                  <option>Buy</option>
                  <option>Sell</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  placeholder="0"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="sm:col-span-4 flex justify-end">
                <button
                  type="submit"
                  className="mt-2 px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}