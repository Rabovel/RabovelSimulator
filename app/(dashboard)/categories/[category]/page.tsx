// app/categories/[category]/page.tsx
"use client";
import { useParams } from 'next/navigation';
import Head from 'next/head';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TableHeader } from '@/components/TableHeader';

// Sample stock data for each category
const categoryStocks: { [key: string]: { symbol: string; price: number; change: string }[] } = {
  agro: [
    { symbol: 'OKOMUOIL', price: 150.00, change: '+2.5%' },
    { symbol: 'PRESCO', price: 200.50, change: '-1.2%' },
    { symbol: 'FLOURMILL', price: 35.75, change: '+0.8%' },
  ],
  'real-estate': [
    { symbol: 'UPDC', price: 5.20, change: '+1.5%' },
    { symbol: 'WAPCO', price: 28.00, change: '-0.9%' },
    { symbol: 'SKYAVN', price: 450.00, change: '+3.1%' },
  ],
  insurance: [
    { symbol: 'AIICO', price: 1.10, change: '+1.0%' },
    { symbol: 'NEM', price: 4.50, change: '-0.5%' },
    { symbol: 'CUSTODIAN', price: 7.80, change: '+2.3%' },
  ],
  tech: [
    { symbol: 'MTNN', price: 250.00, change: '+2.0%' },
    { symbol: 'AIRTELAFRI', price: 900.00, change: '+1.7%' },
    { symbol: 'CWG', price: 2.30, change: '-0.8%' },
  ],
  banking: [
    { symbol: 'ZENITHBANK', price: 30.75, change: '+0.8%' },
    { symbol: 'GUARANTY', price: 35.20, change: '-2.2%' },
    { symbol: 'ACCESS', price: 18.50, change: '+1.1%' },
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

      <main className="flex-grow pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold mb-4 capitalize">{category} Stocks</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <TableHeader columns={["Symbol", "Price", "Change"]} />
                <tbody className="divide-y divide-gray-200">
                  {stocks.map((stock, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{stock.symbol}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{stock.price.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-sm ${stock.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}