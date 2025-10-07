import "./globals.css";

export const metadata = {
  title: "Trading Dashboard",
  description: "Manage your portfolio, funds, and transactions with ease",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <main className="flex flex-col min-h-screen">
          {/* Centered and responsive main container */}
          <div className="flex-grow flex items-start justify-center px-6 py-10">
            <div className="w-full max-w-7xl">{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}
