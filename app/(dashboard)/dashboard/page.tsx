// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MetricCard } from "@/components/MetricCard";
import { TableHeader } from "@/components/TableHeader";
import { WatchlistRow } from "@/components/WatchlistRow";
import { PositionRow } from "@/components/PositionRow";
import { CategoryCard } from "@/components/CategoryCard";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Plus, X, Landmark, Tractor, HousePlus, ShieldCheck, Cpu} from "lucide-react";

const initialWatchlist = [
  { symbol: "MTNN", last: 250.0, change: 5.0, percentChange: 2.04, direction: "positive", volume: 12500 },
  { symbol: "DANGCEM", last: 280.5, change: -3.5, percentChange: -1.23, direction: "negative", volume: 8900 },
  { symbol: "ZENITHBANK", last: 30.75, change: 0.25, percentChange: 0.82, direction: "positive", volume: 45000 },
  { symbol: "GUARANTY", last: 35.2, change: -0.8, percentChange: -2.22, direction: "negative", volume: 38700 },
  { symbol: "AIRTELAFRI", last: 900.0, change: 15.0, percentChange: 1.69, direction: "positive", volume: 5600 },
];

const stockCategories = [
  { title: "Agro Stocks", image: "/agro.png", description: "Agricultural companies and commodities", category: "agro" },
  { title: "Real Estate", image: "/real-estate.png", description: "Property development & management", category: "real-estate" },
  { title: "Insurance", image: "/insurance.png", description: "Insurance providers & services", category: "insurance" },
  { title: "Tech Stocks", image: "/tech.png", description: "Technology & innovation companies", category: "tech" },
  { title: "Banking", image: "/banking.png", description: "Financial institutions & banks", category: "banking" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"Options" | "Stocks" | "History">("Options");
  const [timeFrame, setTimeFrame] = useState("1D");
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock metrics data
  const dashboardMetrics = {
    portfolioValue: "$34,782.56",
    dayPL: "+$423.18",
    openPositions: 14,
    buyingPower: "$12,340.00",
    totalPL: "+$2,156.89",
    winRate: "62.5%",
    avgTradeDuration: "3.4 days",
    exposure: "$18,450.00",
  };

  const positionsData = {
    options: [
      { symbol: "MTNN", type: "CALL", strike: 260, expiration: "Mar 21", quantity: 10, entry: 5.0, current: 6.5, pl: 1500, direction: "positive" },
      { symbol: "DANGCEM", type: "PUT", strike: 270, expiration: "Apr 18", quantity: 5, entry: 8.0, current: 6.0, pl: -1000, direction: "negative" },
    ],
    stocks: [
      { symbol: "ZENITHBANK", quantity: 100, avgPrice: 30.0, current: 30.75, pl: 75, direction: "positive" },
      { symbol: "GUARANTY", quantity: 50, avgPrice: 36.0, current: 35.2, pl: -40, direction: "negative" },
    ],
    history: [
      { symbol: "MTNN", type: "CALL", profit: 1200, date: "Mar 10", status: "closed" },
      { symbol: "DANGCEM", type: "PUT", profit: -450, date: "Mar 12", status: "closed" },
    ],
  };

  // --- 🧠 Button Handlers ---
  const handleAddStock = () => {
    if (!newSymbol.trim()) return;
    setWatchlist([
      ...watchlist,
      { symbol: newSymbol.toUpperCase(), last: 100, change: 0, percentChange: 0, direction: "neutral", volume: 1000 },
    ]);
    setNewSymbol("");
    setShowAddModal(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const refreshed = watchlist.map((s) => ({
        ...s,
        last: s.last + (Math.random() * 10 - 5),
        change: parseFloat((Math.random() * 5 - 2).toFixed(2)),
        percentChange: parseFloat((Math.random() * 3 - 1.5).toFixed(2)),
      }));
      setWatchlist(refreshed);
      setIsRefreshing(false);
    }, 1000);
  };

  const handleViewAllCategories = () => {
    alert("Navigating to All Categories page (in real app, this would be a route change).");
  };

  // --- 🧩 Render Logic ---
  const renderPositions = () => {
    switch (activeTab) {
      case "Options":
        return positionsData.options.map((p, i) => <PositionRow key={i} position={p} />);
      case "Stocks":
        return positionsData.stocks.map((s, i) => (
          <tr key={i} className="hover:bg-gray-50 transition">
            <td className="px-4 py-3 font-medium">{s.symbol}</td>
            <td className="px-4 py-3">{s.quantity}</td>
            <td className="px-4 py-3">${s.avgPrice}</td>
            <td className="px-4 py-3">${s.current}</td>
            <td className={`px-4 py-3 font-semibold ${s.direction === "positive" ? "text-green-500" : "text-red-500"}`}>${s.pl}</td>
          </tr>
        ));
      case "History":
        return positionsData.history.map((h, i) => (
          <tr key={i} className="hover:bg-gray-50 transition">
            <td className="px-4 py-3">{h.symbol}</td>
            <td className="px-4 py-3">{h.type}</td>
            <td className={`px-4 py-3 ${h.profit > 0 ? "text-green-500" : "text-red-500"}`}>${h.profit}</td>
            <td className="px-4 py-3">{h.date}</td>
          </tr>
        ));
    }
  };

  const headers =
    activeTab === "Options"
      ? ["Symbol", "Type", "Strike", "Exp.", "Qty", "Entry", "Current", "P/L"]
      : activeTab === "Stocks"
      ? ["Symbol", "Quantity", "Avg. Price", "Current", "P/L"]
      : ["Symbol", "Type", "Profit", "Date"];

  // --- 🧱 UI ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {Object.entries(dashboardMetrics).map(([key, val]) => (
            <MetricCard
              key={key}
              title={key.replace(/([A-Z])/g, " $1")}
              value={val.toString()}
              valueClass={val.toString().startsWith("+") ? "text-green-500" : val.toString().startsWith("-") ? "text-red-500" : ""}
            />
          ))}
        </div>

        {/* Watchlist + Positions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Watchlist */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Watchlist</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  <Plus size={14} /> Add
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`flex items-center gap-1 px-3 py-1 text-sm border rounded-lg transition ${
                    isRefreshing
                      ? "border-gray-300 text-gray-400 cursor-wait"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <RefreshCcw size={14} className={isRefreshing ? "animate-spin" : ""} />{" "}
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <TableHeader columns={["Symbol", "Last", "Change", "Volume"]} />
                <tbody className="divide-y divide-gray-100">
                  {watchlist.map((item, i) => (
                    <WatchlistRow key={i} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Positions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <nav className="flex gap-6 border-b border-gray-200">
                {["Options", "Stocks", "History"].map((tab) => (
                  <button
                    key={tab}
                    className={`py-2 text-sm font-medium ${
                      activeTab === tab ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                {activeTab !== "History" && (
                  <select
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                  >
                    {["1D", "1W", "1M", "ALL"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                )}
                <span className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg">
                  {activeTab === "Options"
                    ? positionsData.options.length
                    : activeTab === "Stocks"
                    ? positionsData.stocks.length
                    : positionsData.history.length}{" "}
                  positions
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <TableHeader columns={headers} />
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence mode="wait">
                    <motion.tr
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    />
                    {renderPositions()}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Explore Categories */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Explore Stock Categories</h2>
            <button onClick={handleViewAllCategories} className="text-blue-600 text-sm hover:underline">
              View All
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stocks by symbol or name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {stockCategories
              .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()))
              .map((c) => {
                // Choose an icon for each category (replace with your preferred LucideIcon imports)
                let icon;
                switch (c.category) {
                  case "agro":
                    icon = Tractor; // Replace with an appropriate icon
                    break;
                  case "real-estate":
                    icon = HousePlus; // Replace with an appropriate icon
                    break;
                  case "insurance":
                    icon = ShieldCheck; // Replace with an appropriate icon
                    break;
                  case "tech":
                    icon = Cpu; // Replace with an appropriate icon
                    break;
                  case "banking":
                    icon = Landmark; // Replace with an appropriate icon
                    break;
                  default:
                    icon = Plus;
                }
                return <CategoryCard icon={icon} key={c.category} {...c} />;
              })}
          </div>
        </div>
      </main>

      <Footer />

      {/* Add Stock Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 w-80 shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add to Watchlist</h3>
                <button onClick={() => setShowAddModal(false)}>
                  <X size={18} />
                </button>
              </div>
              <input
                type="text"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="Enter stock symbol (e.g. AAPL)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <button
                onClick={handleAddStock}
                className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Add Stock
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
