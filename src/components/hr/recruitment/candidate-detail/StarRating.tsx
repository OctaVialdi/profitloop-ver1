
import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(rating => (
        <button 
          key={rating} 
          type="button" 
          onClick={() => onChange(rating)} 
          className="p-1 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Star className={`h-6 w-6 ${rating <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        </button>
      ))}
    </div>
  );
};
