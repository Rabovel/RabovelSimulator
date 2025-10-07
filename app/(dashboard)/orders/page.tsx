/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/orders/page.tsx
"use client";

import { useState } from "react";
import Head from "next/head";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MetricCard } from "@/components/MetricCard";
import {
  Search,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const orderMetrics = {
  openOrders: 8,
  filledToday: 12,
  totalOrders: 156,
  pendingValue: "$3,450.00",
};

const initialOpenOrders = [
  { id: "O1", symbol: "MTNN", type: "Buy", quantity: 100, price: 250.5, status: "Pending", time: "09:15", date: "Mar 16, 2025" },
  { id: "O2", symbol: "DANGCEM", type: "Sell", quantity: 50, price: 280.0, status: "Pending", time: "10:30", date: "Mar 16, 2025" },
  { id: "O3", symbol: "ZENITHBANK", type: "Buy", quantity: 200, price: 30.75, status: "Partially Filled", time: "11:45", date: "Mar 16, 2025" },
  { id: "O4", symbol: "GUARANTY", type: "Sell", quantity: 150, price: 35.2, status: "Pending", time: "13:20", date: "Mar 16, 2025" },
  { id: "O5", symbol: "AIRTELAFRI", type: "Buy", quantity: 20, price: 900.0, status: "Pending", time: "14:10", date: "Mar 16, 2025" },
  { id: "O6", symbol: "MTNN", type: "Sell", quantity: 75, price: 251.0, status: "Pending", time: "15:00", date: "Mar 16, 2025" },
];

const orderHistory = [
  { id: "H1", symbol: "MTNN", type: "Buy", quantity: 150, price: 248.0, status: "Filled", time: "09:30", date: "Mar 15, 2025" },
  { id: "H2", symbol: "DANGCEM", type: "Sell", quantity: 100, price: 282.5, status: "Filled", time: "10:45", date: "Mar 15, 2025" },
  { id: "H3", symbol: "ZENITHBANK", type: "Buy", quantity: 300, price: 30.5, status: "Cancelled", time: "11:15", date: "Mar 15, 2025" },
  { id: "H4", symbol: "GUARANTY", type: "Sell", quantity: 200, price: 35.8, status: "Filled", time: "13:30", date: "Mar 14, 2025" },
  { id: "H5", symbol: "AIRTELAFRI", type: "Buy", quantity: 30, price: 895.0, status: "Filled", time: "14:45", date: "Mar 14, 2025" },
];

export default function Orders() {
  const [activeTab, setActiveTab] = useState("Open");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openOrders, setOpenOrders] = useState(initialOpenOrders);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    symbol: "",
    type: "Buy",
    quantity: "",
    price: "",
  });
  const itemsPerPage = 5;

  const handleCancelOrder = (orderId: string) => {
    setOpenOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
  };

  const handleAddNewOrder = () => {
    if (!newOrder.symbol || !newOrder.quantity || !newOrder.price) return;

    const id = `O${openOrders.length + 1}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const order = {
      id,
      symbol: newOrder.symbol.toUpperCase(),
      type: newOrder.type,
      quantity: Number(newOrder.quantity),
      price: Number(newOrder.price),
      status: "Pending",
      time: formattedTime,
      date: formattedDate,
    };

    setOpenOrders((prev) => [order, ...prev]);
    setShowNewOrderModal(false);
    setNewOrder({ symbol: "", type: "Buy", quantity: "", price: "" });
  };

  const filteredData = (activeTab === "Open" ? openOrders : orderHistory).filter(
    (order) =>
      [order.id, order.symbol, order.date].some((field) =>
        field.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
      <Head>
        <title>Order Management</title>
      </Head>

      <Header />

      <main className="flex-grow pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Orders Dashboard
            </h1>
            <button
              onClick={() => setShowNewOrderModal(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow-sm transition"
            >
              <PlusCircle size={18} />
              <span>New Order</span>
            </button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard title="Open Orders" value={openOrders.length.toString()} />
            <MetricCard title="Filled Today" value={orderMetrics.filledToday.toString()} />
            <MetricCard title="Total Orders" value={orderMetrics.totalOrders.toString()} />
            <MetricCard title="Pending Value" value={orderMetrics.pendingValue} />
          </div>

          {/* Tabs and Search */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
              <div className="flex bg-gray-100 p-1 rounded-full w-fit">
                {["Open", "History"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 text-sm rounded-full transition ${
                      activeTab === tab
                        ? "bg-blue-600 text-white shadow"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by ID or Symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full sm:w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                  <tr>
                    {["ID", "Symbol", "Type", "Qty", "Price", "Status", "Time", "Date", "Actions"].map((header) => (
                      <th key={header} className="px-4 py-3 text-left">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedData.map((order) => (
                    <motion.tr
                      key={order.id}
                      whileHover={{ backgroundColor: "#f9fafb" }}
                      className="transition"
                    >
                      <td className="px-4 py-3 font-medium">{order.id}</td>
                      <td className="px-4 py-3">{order.symbol}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.type === "Buy"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">{order.quantity}</td>
                      <td className="px-4 py-3">${order.price.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "Filled"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "Partially Filled"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{order.time}</td>
                      <td className="px-4 py-3">{order.date}</td>
                      <td className="px-4 py-3 space-x-2">
                        {activeTab === "Open" && order.status !== "Filled" && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600 hover:text-red-800 transition"
                            aria-label={`Cancel order ${order.id}`}
                          >
                            <X size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
              <span>
                Showing {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ✅ Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Details
              </h2>
              <div className="space-y-2 text-sm">
                {Object.entries(selectedOrder).map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b py-1">
                    <span className="font-medium capitalize text-gray-600">
                      {key}
                    </span>
                    <span className="text-gray-800">
                      {typeof value === "string" || typeof value === "number"
                        ? value.toString()
                        : JSON.stringify(value)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ New Order Modal */}
      <AnimatePresence>
        {showNewOrderModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Create New Order
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Symbol (e.g., MTNN)"
                  value={newOrder.symbol}
                  onChange={(e) =>
                    setNewOrder((prev) => ({ ...prev, symbol: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <select
                  value={newOrder.type}
                  onChange={(e) =>
                    setNewOrder((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                </select>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newOrder.quantity}
                  onChange={(e) =>
                    setNewOrder((prev) => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newOrder.price}
                  onChange={(e) =>
                    setNewOrder((prev) => ({ ...prev, price: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={handleAddNewOrder}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Order
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
