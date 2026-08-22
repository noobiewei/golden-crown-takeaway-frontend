import { useState, useEffect } from 'react';
import type { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import MenuItemCard from '../components/MenuItemCard';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:8080/api/menu').then((r) => {
        if (!r.ok) throw new Error(`Request failed: ${r.status}`);
        return r.json();
      }),
      fetch('http://localhost:8080/api/menu/popular').then((r) => {
        if (!r.ok) throw new Error(`Request failed: ${r.status}`);
        return r.json();
      }),
    ])
      .then(([menuData, popularData]: [MenuItem[], MenuItem[]]) => {
        setMenuItems(menuData);
        setPopularItems(popularData);
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
      {popularItems.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold text-brand-green mb-1">🔥 Popular Right Now</h2>
          <div className="w-12 h-1 bg-brand-gold rounded-full mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {popularItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
            ))}
          </div>
        </section>
      )}

      {categoriesInOrder.map((category) => (
        <section key={category.id}>
          <h2 className="font-display text-2xl font-bold text-brand-green mb-1">{category.name}</h2>
          <div className="w-12 h-1 bg-brand-gold rounded-full mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {menuItems
              .filter((item) => item.category.id === category.id)
              .map((item) => (
                <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
