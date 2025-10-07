"use client";

import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TableHeader } from "@/components/TableHeader";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// Sample stock data
const categoryStocks: {
  [key: string]: { symbol: string; price: number; change: string }[];
} = {
  agro: [
    { symbol: "OKOMUOIL", price: 150.0, change: "+2.5%" },
    { symbol: "PRESCO", price: 200.5, change: "-1.2%" },
    { symbol: "FLOURMILL", price: 35.75, change: "+0.8%" },
  ],
  "real-estate": [
    { symbol: "UPDC", price: 5.2, change: "+1.5%" },
    { symbol: "WAPCO", price: 28.0, change: "-0.9%" },
    { symbol: "SKYAVN", price: 450.0, change: "+3.1%" },
  ],
  insurance: [
    { symbol: "AIICO", price: 1.1, change: "+1.0%" },
    { symbol: "NEM", price: 4.5, change: "-0.5%" },
    { symbol: "CUSTODIAN", price: 7.8, change: "+2.3%" },
  ],
  tech: [
    { symbol: "MTNN", price: 250.0, change: "+2.0%" },
    { symbol: "AIRTELAFRI", price: 900.0, change: "+1.7%" },
    { symbol: "CWG", price: 2.3, change: "-0.8%" },
  ],
  banking: [
    { symbol: "ZENITHBANK", price: 30.75, change: "+0.8%" },
    { symbol: "GUARANTY", price: 35.2, change: "-2.2%" },
    { symbol: "ACCESS", price: 18.5, change: "+1.1%" },
  ],
};

export default function CategoryDetail() {
  const { category } = useParams();
  const stocks = categoryStocks[category as string] || [];

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
