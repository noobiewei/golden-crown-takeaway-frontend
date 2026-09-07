import type { MenuItem } from '../types';

function TakeoutBoxIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      className="w-10 h-10"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 24 L14 12 H50 L54 24" />
      <path d="M10 24 L22 8" />
      <path d="M54 24 L42 8" />
      <path d="M10 24 H54 V52 A2 2 0 0 1 52 54 H12 A2 2 0 0 1 10 52 Z" />
      <path d="M32 12 V54" />
    </svg>
  );
}

export default function DishImage({
  item,
  className = 'w-full h-36',
}: {
  item: MenuItem;
  className?: string;
}) {
  if (item.imageUrl) {
    return <img src={item.imageUrl} alt={item.name} className={`${className} rounded-lg object-cover`} />;
  }

  return (
    <div
      className={`${className} rounded-lg bg-gradient-to-br from-brand-green/15 to-brand-gold/15 flex items-center justify-center text-brand-green/40`}
    >
      <TakeoutBoxIcon />
    </div>
  );
}
