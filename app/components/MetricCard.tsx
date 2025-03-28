// components/MetricCard.tsx
interface MetricCardProps {
  title: string;
  value: string;
  valueClass?: string;
}

export function MetricCard({ title, value, valueClass = "" }: MetricCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className={`text-2xl font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}