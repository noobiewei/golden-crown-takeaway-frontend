import type { DishExtra, MenuItem } from '../types';
import DishImage from './DishImage';

export default function MenuItemCard({
  item,
  onAdd,
  extras = [],
  onCustomise,
}: {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  extras?: DishExtra[];
  onCustomise?: (item: MenuItem) => void;
}) {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-black/5 p-5 hover:shadow-md transition-shadow">
      <DishImage item={item} className="w-full h-40 mb-3" />

      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-brand-ink">{item.name}</h3>
        <span className="font-semibold text-brand-green whitespace-nowrap">
          £{item.price.toFixed(2)}
        </span>
      </div>

      {(item.vegetarian || item.spicy || item.containsNuts) && (
        <div className="flex gap-1.5 mt-1.5">
          {item.vegetarian && (
            <span title="Vegetarian" className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
              🌱 Veg
            </span>
          )}
          {item.spicy && (
            <span title="Spicy" className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5">
              🌶️ Spicy
            </span>
          )}
          {item.containsNuts && (
            <span title="Contains nuts" className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">
              🥜 Nuts
            </span>
          )}
        </div>
      )}

      <p className="text-sm text-brand-ink/60 mt-2 flex-1">{item.description}</p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onAdd(item)}
          className="self-start bg-brand-green text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-green-dark transition-colors"
        >
          Add to Cart
        </button>
        {extras.length > 0 && onCustomise && (
          <button
            type="button"
            onClick={() => onCustomise(item)}
            className="self-start border border-brand-green text-brand-green text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-green/5 transition-colors"
          >
            Customise
          </button>
        )}
      </div>
    </div>
  );
}
