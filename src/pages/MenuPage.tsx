import { useState, useEffect, useMemo, useRef } from 'react';
import type { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import MenuItemCard from '../components/MenuItemCard';
import PopularCarousel from '../components/PopularCarousel';
import Hero from '../components/Hero';
import MenuAssistant from '../components/MenuAssistant';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [popularItems, setPopularItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const didInitExpansion = useRef(false);
  const { addToCart } = useCart();

  useEffect(() => {
    Promise.all([
      fetch('/api/menu').then((r) => {
        if (!r.ok) throw new Error(`Request failed: ${r.status}`);
        return r.json();
      }),
      fetch('/api/menu/popular').then((r) => {
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

  // Open the first category by default so the page isn't empty on load,
  // but only once — otherwise this would re-fire and re-open it every time
  // the user collapses everything back down.
  useEffect(() => {
    if (!didInitExpansion.current && categoriesInOrder.length > 0) {
      setExpandedCategories(new Set([categoriesInOrder[0].id]));
      didInitExpansion.current = true;
    }
  }, [categoriesInOrder]);

  function toggleCategory(id: number) {
    setExpandedCategories((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function scrollToCategory(id: number) {
    setExpandedCategories((current) => new Set(current).add(id));
    setTimeout(() => {
      document.getElementById(`category-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

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

      {!trimmedQuery && (
        <>
          <MenuAssistant onAdd={addToCart} />

          <div className="flex items-center gap-3 my-5">
            <div className="h-px bg-black/10 flex-1" />
            <span className="text-xs font-medium text-brand-ink/40 uppercase tracking-wide">Or</span>
            <div className="h-px bg-black/10 flex-1" />
          </div>
        </>
      )}

      <p className="text-sm font-medium text-brand-ink/70 mb-2">🔍 Search by dish name</p>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="e.g. spring rolls"
        autoComplete="off"
        className="w-full rounded-full border border-black/10 bg-white px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
      />

      {!trimmedQuery && (
        <nav className="flex gap-2 overflow-x-auto mt-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categoriesInOrder.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => scrollToCategory(category.id)}
              className="shrink-0 px-4 py-1.5 rounded-full text-sm font-medium bg-white border border-black/10 text-brand-ink/70 hover:bg-brand-green hover:text-white hover:border-brand-green transition-colors"
            >
              {category.name}
            </button>
          ))}
        </nav>
      )}

      <div className="space-y-4 mt-10">
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
              <section className="mb-10">
                <h2 className="font-display text-2xl font-bold text-brand-green mb-1">🔥 Popular Right Now</h2>
                <div className="w-12 h-1 bg-brand-gold rounded-full mb-6" />
                <PopularCarousel items={popularItems} onAdd={addToCart} />
              </section>
            )}

            {categoriesInOrder.map((category) => {
              const items = menuItems.filter((item) => item.category.id === category.id);
              const isExpanded = expandedCategories.has(category.id);

              return (
                <section key={category.id} id={`category-${category.id}`} className="scroll-mt-24 border-b border-black/5 pb-4">
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    aria-expanded={isExpanded}
                    className="w-full flex items-center justify-between gap-3 py-2 text-left"
                  >
                    <span className="font-display text-2xl font-bold text-brand-green">
                      {category.name}
                      <span className="ml-2 text-sm font-sans font-normal text-brand-ink/40">
                        {items.length} {items.length === 1 ? 'dish' : 'dishes'}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 text-brand-green text-xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </button>

                  {isExpanded && (
                    <>
                      <div className="w-12 h-1 bg-brand-gold rounded-full mb-6 mt-1" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {items.map((item) => (
                          <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
                        ))}
                      </div>
                    </>
                  )}
                </section>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
