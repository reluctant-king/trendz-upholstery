import { Star } from 'lucide-react';

export default function Stars({ rating = 5, className = '' }) {
  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={15}
          className={i <= rating ? 'fill-gold text-gold' : 'fill-ink/15 text-ink/15'}
        />
      ))}
    </div>
  );
}
