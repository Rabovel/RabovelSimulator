// app/components/CategoryCard.tsx
"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CategoryCardProps {
  title: string;
  image: string; // Path to the transparent image
  description: string;
  category: string; // Used for routing
}

export function CategoryCard({ title, image, description, category }: CategoryCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/categories/${category.toLowerCase()}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow hover:shadow-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer group overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative w-full h-48">
        <Image
          src="/images/anima.jpg"
          alt={`${title} category`}
          fill
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-110 transition-transform duration-300"
        />
        {/* Content Container */}
        <div className="absolute  inset-0 flex flex-col items-center justify-center text-center bg-opacity-50 p-4">
          <h3 className="text-lg   font-semibold mb-2">{title}</h3>
          <p className="text-sm ">{description}</p>
        </div>
      </div>

      
    </div>
  );
}