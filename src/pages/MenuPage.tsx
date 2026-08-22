import { useState, useEffect } from 'react';
import type { MenuItem } from '../types';
import { useCart } from '../context/CartContext';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('http://localhost:8080/api/menu')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data: MenuItem[]) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-brand-ink/60 py-20">Loading menu...</p>;
  if (error) return <p className="text-center text-red-600 py-20">Error loading menu: {error}</p>;

  const categoriesInOrder = [...new Map(menuItems.map((item) => [item.category.id, item.category])).values()]
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-14">
      {categoriesInOrder.map((category) => (
        <section key={category.id}>
          <h2 className="font-display text-2xl font-bold text-brand-green mb-1">{category.name}</h2>
          <div className="w-12 h-1 bg-brand-gold rounded-full mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {menuItems
              .filter((item) => item.category.id === category.id)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col bg-white rounded-xl shadow-sm border border-black/5 p-5 hover:shadow-md transition-shadow"
                >
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

                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="mt-4 self-start bg-brand-green text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-brand-green-dark transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
