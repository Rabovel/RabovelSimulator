import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

export function CategoryCard({
  title,
  description,
  category,
  icon: Icon,
}: CategoryCardProps) {
  return (
    <Link href={`/categories/${category}`}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gray-50 hover:bg-white transition-all border border-gray-100 shadow-sm hover:shadow-md rounded-2xl p-5 flex flex-col items-center text-center"
      >
        <div className="p-3 bg-blue-100 rounded-full mb-3">
          <Icon className="w-6 h-6 text-blue-600" /> {/* ✅ fixed */}
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </motion.div>
    </Link>
  );
}
