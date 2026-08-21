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

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>Error loading menu: {error}</p>;

  const categoriesInOrder = [...new Map(menuItems.map((item) => [item.category.id, item.category])).values()]
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div>
      <h1>Golden Crown Takeaway</h1>
      {categoriesInOrder.map((category) => (
        <section key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {menuItems
              .filter((item) => item.category.id === category.id)
              .map((item) => (
                <li key={item.id}>
                  <strong>{item.name}</strong> — £{item.price.toFixed(2)}
                  {item.vegetarian && <span> 🌱</span>}
                  {item.spicy && <span> 🌶️</span>}
                  {item.containsNuts && <span> 🥜</span>}
                  <p>{item.description}</p>
                  <button type="button" onClick={() => addToCart(item)}>
                    Add to Cart
                  </button>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
