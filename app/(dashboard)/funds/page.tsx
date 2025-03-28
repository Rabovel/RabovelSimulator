// app/dashboard/funds/page.tsx
"use client";
import { useState } from 'react';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MetricCard } from '@/components/MetricCard';

const accountData = {
  availableBalance: "$12,340.00",
  pendingFunds: "$500.00",
  totalDeposits: "$45,890.00",
  totalWithdrawals: "$33,050.00",
};

const transactionHistory = [
  { id: 'T1', date: 'Mar 15, 2025', type: 'Deposit', amount: 1000.00, status: 'Completed', method: 'Bank Transfer' },
  { id: 'T2', date: 'Mar 14, 2025', type: 'Withdrawal', amount: 500.00, status: 'Pending', method: 'Wire' },
  { id: 'T3', date: 'Mar 13, 2025', type: 'Deposit', amount: 2000.00, status: 'Completed', method: 'Credit Card' },
  { id: 'T4', date: 'Mar 12, 2025', type: 'Withdrawal', amount: 750.00, status: 'Completed', method: 'Bank Transfer' },
  { id: 'T5', date: 'Mar 11, 2025', type: 'Deposit', amount: 1500.00, status: 'Completed', method: 'Wire' },
  { id: 'T6', date: 'Mar 10, 2025', type: 'Deposit', amount: 800.00, status: 'Completed', method: 'Credit Card' },
  { id: 'T7', date: 'Mar 09, 2025', type: 'Withdrawal', amount: 300.00, status: 'Completed', method: 'Wire' },
];

export default function Funds() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState<null | 'deposit' | 'withdraw' | 'transfer'>(null);
  const [formData, setFormData] = useState({ amount: '', method: 'Bank Transfer', account: '' });
  
  const itemsPerPage = 5;
  const filters = ['All', 'Deposits', 'Withdrawals', 'Pending'];

  // Filter and search logic
  const filteredTransactions = transactionHistory.filter((tx) => {
    const matchesFilter = activeFilter === 'All' || 
                         (activeFilter === 'Deposits' && tx.type === 'Deposit') ||
                         (activeFilter === 'Withdrawals' && tx.type === 'Withdrawal') ||
                         (activeFilter === 'Pending' && tx.status === 'Pending');
    const matchesSearch = tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.method.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call
    console.log('Form submitted:', { type: modalType, ...formData });
    setModalType(null);
    setFormData({ amount: '', method: 'Bank Transfer', account: '' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Funds Management</title>
        <meta name="description" content="Manage your trading account funds" />
      </Head>

      <Header />

      <main className="flex-grow pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Account Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Available Balance" value={accountData.availableBalance} />
            <MetricCard title="Pending Funds" value={accountData.pendingFunds} />
            <MetricCard title="Total Deposits" value={accountData.totalDeposits} />
            <MetricCard title="Total Withdrawals" value={accountData.totalWithdrawals} />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => setModalType('deposit')}
                className="flex flex-col items-center justify-center p-4 border border-green-500 rounded-lg hover:bg-green-50"
              >
                <span className="text-green-500 text-2xl mb-2">+</span>
                <span className="text-sm font-medium text-gray-700">Deposit Funds</span>
              </button>
              <button 
                onClick={() => setModalType('withdraw')}
                className="flex flex-col items-center justify-center p-4 border border-red-500 rounded-lg hover:bg-red-50"
              >
                <span className="text-red-500 text-2xl mb-2">-</span>
                <span className="text-sm font-medium text-gray-700">Withdraw Funds</span>
              </button>
              <button 
                onClick={() => setModalType('transfer')}
                className="flex flex-col items-center justify-center p-4 border border-blue-500 rounded-lg hover:bg-blue-50"
              >
                <span className="text-blue-500 text-2xl mb-2">↔</span>
                <span className="text-sm font-medium text-gray-700">Transfer Funds</span>
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-lg font-semibold">Transaction History</h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="flex space-x-2">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      className={`px-3 py-1 text-sm rounded-md ${
                        activeFilter === filter
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        setActiveFilter(filter);
                        setCurrentPage(1);
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search transactions..."
                  className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{tx.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{tx.date}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.type === 'Deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">${tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{tx.method}</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-blue-600 hover:underline text-xs">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} 
                of {filteredTransactions.length} transactions
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

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {modalType === 'deposit' ? 'Deposit Funds' : 
                 modalType === 'withdraw' ? 'Withdraw Funds' : 'Transfer Funds'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    placeholder="Enter amount"
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleFormChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Wire">Wire</option>
                  </select>
                </div>
                {modalType === 'transfer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Destination Account</label>
                    <input
                      type="text"
                      name="account"
                      value={formData.account}
                      onChange={handleFormChange}
                      placeholder="Enter account number"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  {modalType === 'deposit' ? 'Deposit' : 
                   modalType === 'withdraw' ? 'Withdraw' : 'Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}