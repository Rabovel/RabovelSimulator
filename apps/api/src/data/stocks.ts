/** NGX (Nigerian Exchange) listed equities — simulated prices in NGN */
export const MARKET_STOCKS = [
  { symbol: "DANGCEM", name: "Dangote Cement Plc", price: 620.0, exchange: "NGX", sector: "Industrial Goods" },
  { symbol: "MTNN", name: "MTN Nigeria Communications Plc", price: 210.5, exchange: "NGX", sector: "ICT" },
  { symbol: "GTCO", name: "Guaranty Trust Holding Company Plc", price: 52.5, exchange: "NGX", sector: "Banking" },
  { symbol: "ZENITHBANK", name: "Zenith Bank Plc", price: 42.3, exchange: "NGX", sector: "Banking" },
  { symbol: "BUACEMENT", name: "BUA Cement Plc", price: 145.0, exchange: "NGX", sector: "Industrial Goods" },
  { symbol: "AIRTELAFRI", name: "Airtel Africa Plc", price: 2180.0, exchange: "NGX", sector: "ICT" },
  { symbol: "SEPLAT", name: "Seplat Energy Plc", price: 4850.0, exchange: "NGX", sector: "Oil & Gas" },
  { symbol: "FBNH", name: "FBN Holdings Plc", price: 19.5, exchange: "NGX", sector: "Banking" },
  { symbol: "NESTLE", name: "Nestlé Nigeria Plc", price: 1450.0, exchange: "NGX", sector: "Consumer Goods" },
  { symbol: "UBA", name: "United Bank for Africa Plc", price: 38.2, exchange: "NGX", sector: "Banking" },
];

export function getStock(symbol: string) {
  return MARKET_STOCKS.find((s) => s.symbol === symbol.toUpperCase());
}
