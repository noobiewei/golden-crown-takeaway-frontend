import { useState, useEffect, useMemo } from 'react';
import type { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import MenuItemCard from '../components/MenuItemCard';
import PopularCarousel from '../components/PopularCarousel';
import Hero from '../components/Hero';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const categoriesInOrder = useMemo(
    () =>
      [...new Map(menuItems.map((item) => [item.category.id, item.category])).values()].sort(
        (a, b) => a.displayOrder - b.displayOrder
      ),
    [menuItems]
  );

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const searchResults = trimmedQuery
    ? menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(trimmedQuery) ||
          item.description.toLowerCase().includes(trimmedQuery)
      )
    : [];

  if (loading) return <p className="text-center text-brand-ink/60 py-20">Loading menu...</p>;
  if (error) return <p className="text-center text-red-600 py-20">Error loading menu: {error}</p>;

  return (
    <div>
      {!trimmedQuery && (
        <Hero menuAnchorId={categoriesInOrder[0] ? `category-${categoriesInOrder[0].id}` : undefined} />
      )}

      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search the menu…"
        autoComplete="off"
        className="w-full rounded-full border border-black/10 bg-white px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
      />

      {!trimmedQuery && (
        <nav className="flex gap-2 overflow-x-auto mt-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoriesInOrder.map((category) => (
            <a
              key={category.id}
              href={`#category-${category.id}`}
              className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-black/10 text-brand-ink/70 hover:bg-brand-green hover:text-white hover:border-brand-green transition-colors"
            >
              {category.name}
            </a>
          ))}
        </nav>
      )}

      <div className="space-y-14 mt-10">
        {trimmedQuery ? (
          <section>
            <h2 className="font-display text-2xl font-bold text-brand-green mb-1">
              Search results for "{searchQuery.trim()}"
            </h2>
            <div className="w-12 h-1 bg-brand-gold rounded-full mb-6" />
            {searchResults.length === 0 ? (
              <p className="text-brand-ink/60">No dishes match your search.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {searchResults.map((item) => (
                  <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {popularItems.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-bold text-brand-green mb-1">🔥 Popular Right Now</h2>
                <div className="w-12 h-1 bg-brand-gold rounded-full mb-6" />
                <PopularCarousel items={popularItems} onAdd={addToCart} />
              </section>
            )}

            {categoriesInOrder.map((category) => (
              <section key={category.id} id={`category-${category.id}`} className="scroll-mt-24">
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
          </>
        )}
      </div>
    </div>
  );
}
