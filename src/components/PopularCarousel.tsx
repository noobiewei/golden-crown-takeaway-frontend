import { useRef } from 'react';
import type { MenuItem } from '../types';

function ImagePlaceholder() {
  return (
    <div className="w-full h-36 rounded-lg bg-gradient-to-br from-brand-green/20 to-brand-gold/20 flex flex-col items-center justify-center text-brand-ink/40">
      <span className="text-3xl">🍽️</span>
      <span className="text-xs mt-1">Photo coming soon</span>
    </div>
  );
}

export default function PopularCarousel({
  items,
  onAdd,
}: {
  items: MenuItem[];
  onAdd: (item: MenuItem) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * 280, behavior: 'smooth' });
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="snap-start shrink-0 w-64 flex flex-col bg-white rounded-xl shadow-sm border border-black/5 p-4"
          >
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-36 rounded-lg object-cover"
              />
            ) : (
              <ImagePlaceholder />
            )}

            <div className="flex items-start justify-between gap-2 mt-3">
              <h3 className="font-semibold text-brand-ink text-sm">{item.name}</h3>
              <span className="font-semibold text-brand-green text-sm whitespace-nowrap">
                £{item.price.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onAdd(item)}
              className="mt-3 bg-brand-green text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-green-dark transition-colors"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        aria-label="Scroll left"
        className="hidden sm:flex absolute -left-4 top-1/3 -translate-y-1/2 items-center justify-center w-9 h-9 rounded-full bg-white shadow-md border border-black/5 hover:bg-brand-cream"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        aria-label="Scroll right"
        className="hidden sm:flex absolute -right-4 top-1/3 -translate-y-1/2 items-center justify-center w-9 h-9 rounded-full bg-white shadow-md border border-black/5 hover:bg-brand-cream"
      >
        ›
      </button>
    </div>
  );
}
