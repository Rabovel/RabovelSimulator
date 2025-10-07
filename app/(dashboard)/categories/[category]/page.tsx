"use client";

import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TableHeader } from "@/components/TableHeader";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Sprout,
  Building2,
  ShieldCheck,
  Cpu,
  Landmark,
} from "lucide-react";

// Sample stock data
const categoryStocks=  [
  {
    title: "Agro Stocks",
    icon: Sprout,
    description: "Agricultural companies and commodities",
    category: "agro",
    symbol: "AGR",
    price: 120.45,
    change: "+2.15",
  },
  {
    title: "Real Estate",
    icon: Building2,
    description: "Property development & management",
    category: "real-estate",
    symbol: "REA",
    price: 305.10,
    change: "-1.20",
  },
  {
    title: "Insurance",
    icon: ShieldCheck,
    description: "Insurance providers & services",
    category: "insurance",
    symbol: "INS",
    price: 89.75,
    change: "+0.80",
  },
  {
    title: "Tech Stocks",
    icon: Cpu,
    description: "Technology & innovation companies",
    category: "tech",
    symbol: "TEC",
    price: 450.00,
    change: "+5.00",
  },
  {
    title: "Banking",
    icon: Landmark,
    description: "Financial institutions & banks",
    category: "banking",
    symbol: "BNK",
    price: 210.30,
    change: "-0.50",
  },
];

export default function CategoryDetail() {
  const { category } = useParams();
  const stocks = categoryStocks.filter((stock) => stock.category === category) || [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Head>
        <title>{`${category} Stocks`}</title>
        <meta name="description" content={`List of ${category} stocks`} />
      </Head>

      <Header />

      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 capitalize">
              {category} Stocks
            </h1>
            <p className="text-sm text-gray-500">
              Updated just now • {stocks.length} companies
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-lg rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <TableHeader columns={["Symbol", "Price (₦)", "Change"]} />
                <tbody className="divide-y divide-gray-100">
                  {stocks.map((stock, index) => {
                    const isPositive = stock.change.startsWith("+");
                    return (
                      <motion.tr
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {stock.symbol}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          ₦{stock.price.toFixed(2)}
                        </td>
                        <td
                          className={`px-6 py-4 flex items-center gap-1 font-medium ${
                            isPositive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          {stock.change}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
