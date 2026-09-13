import React from "react";
import { Star } from "lucide-react";

export default function RatingStars({ rating = 0, size = 14, showValue = false }) {
  const filled = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          className={i < filled ? "fill-accent text-accent" : "text-muted-foreground/40"}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
