"use client";

import { useState } from "react";
import Head from "next/head";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  X,
  Search,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MetricCard } from "@/components/MetricCard";

const accountData = {
  availableBalance: "$12,340.00",
  pendingFunds: "$500.00",
  totalDeposits: "$45,890.00",
  totalWithdrawals: "$33,050.00",
};

const transactionHistory = [
  { id: "T1", date: "Mar 15, 2025", type: "Deposit", amount: 1000.0, status: "Completed", method: "Bank Transfer" },
  { id: "T2", date: "Mar 14, 2025", type: "Withdrawal", amount: 500.0, status: "Pending", method: "Wire" },
  { id: "T3", date: "Mar 13, 2025", type: "Deposit", amount: 2000.0, status: "Completed", method: "Credit Card" },
  { id: "T4", date: "Mar 12, 2025", type: "Withdrawal", amount: 750.0, status: "Completed", method: "Bank Transfer" },
  { id: "T5", date: "Mar 11, 2025", type: "Deposit", amount: 1500.0, status: "Completed", method: "Wire" },
  { id: "T6", date: "Mar 10, 2025", type: "Deposit", amount: 800.0, status: "Completed", method: "Credit Card" },
  { id: "T7", date: "Mar 09, 2025", type: "Withdrawal", amount: 300.0, status: "Completed", method: "Wire" },
];

export default function Funds() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState<null | "deposit" | "withdraw" | "transfer">(null);
  const [formData, setFormData] = useState({ amount: "", method: "Bank Transfer", account: "" });
  const [selectedTransaction, setSelectedTransaction] = useState<null | typeof transactionHistory[number]>(null);

  const itemsPerPage = 5;
  const filters = ["All", "Deposits", "Withdrawals", "Pending"];

  const filteredTransactions = transactionHistory.filter((tx) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Deposits" && tx.type === "Deposit") ||
      (activeFilter === "Withdrawals" && tx.type === "Withdrawal") ||
      (activeFilter === "Pending" && tx.status === "Pending");

    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.date.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { type: modalType, ...formData });
    setModalType(null);
    setFormData({ amount: "", method: "Bank Transfer", account: "" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>Funds Dashboard</title>
        <meta name="description" content="Manage your trading funds efficiently" />
      </Head>

      <Header />

      <main className="flex-grow pb-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Balance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10"
          >
            <MetricCard title="Available Balance" value={accountData.availableBalance} />
            <MetricCard title="Pending Funds" value={accountData.pendingFunds} />
            <MetricCard title="Total Deposits" value={accountData.totalDeposits} />
            <MetricCard title="Total Withdrawals" value={accountData.totalWithdrawals} />
          </motion.div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ActionButton
                color="green"
                icon={<ArrowUpCircle className="w-6 h-6" />}
                label="Deposit Funds"
                onClick={() => setModalType("deposit")}
              />
              <ActionButton
                color="red"
                icon={<ArrowDownCircle className="w-6 h-6" />}
                label="Withdraw Funds"
                onClick={() => setModalType("withdraw")}
              />
              <ActionButton
                color="blue"
                icon={<ArrowLeftRight className="w-6 h-6" />}
                label="Transfer Funds"
                onClick={() => setModalType("transfer")}
              />
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
              <h2 className="text-lg font-semibold text-gray-800">Transaction History</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="flex space-x-2">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setActiveFilter(filter);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all ${
                        activeFilter === filter
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transactions..."
                    className="w-full sm:w-64 pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                    {["ID", "Date", "Type", "Amount", "Status", "Method", "Actions"].map((col) => (
                      <th key={col} className="px-4 py-3 text-left font-semibold tracking-wide">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedTransactions.map((tx) => (
                    <motion.tr
                      key={tx.id}
                      whileHover={{ scale: 1.01 }}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 font-medium">{tx.id}</td>
                      <td className="px-4 py-3 text-gray-600">{tx.date}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            tx.type === "Deposit"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium">${tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            tx.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{tx.method}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedTransaction(tx)}
                          className="text-blue-600 hover:underline text-xs"
                        >
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-5 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{" "}
                {filteredTransactions.length}
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border rounded-full disabled:opacity-40 hover:bg-gray-100"
                >
                  Prev
                </button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border rounded-full disabled:opacity-40 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Deposit / Withdraw / Transfer Modal */}
      <AnimatePresence>
        {modalType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold capitalize text-gray-800">
                  {modalType} Funds
                </h3>
                <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleFormChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleFormChange}
                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Wire">Wire</option>
                  </select>
                </div>
                {modalType === "transfer" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Destination Account</label>
                    <input
                      type="text"
                      name="account"
                      value={formData.account}
                      onChange={handleFormChange}
                      placeholder="Enter account number"
                      required
                      className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setModalType(null)}
                    className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Confirm {modalType}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Transaction Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white bg-opacity-30 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <DetailRow label="Transaction ID" value={selectedTransaction.id} />
                <DetailRow label="Date" value={selectedTransaction.date} />
                <DetailRow label="Type" value={selectedTransaction.type} />
                <DetailRow
                  label="Amount"
                  value={`$${selectedTransaction.amount.toFixed(2)}`}
                />
                <DetailRow label="Status" value={selectedTransaction.status} />
                <DetailRow label="Method" value={selectedTransaction.method} />
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function ActionButton({
  color,
  icon,
  label,
  onClick,
}: {
  color: "green" | "red" | "blue";
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  const colors = {
    green: "text-green-600 bg-green-50 border-green-200 hover:bg-green-100",
    red: "text-red-600 bg-red-50 border-red-200 hover:bg-red-100",
    blue: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100",
  };
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-5 border rounded-2xl transition ${colors[color]}`}
    >
      {icon}
      <span className="mt-2 text-sm font-medium">{label}</span>
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-100 pb-1">
      <span className="text-gray-500 font-medium">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
