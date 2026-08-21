import { useState, useEffect } from 'react';
import type { MenuItem } from './types';
import './App.css';

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div>
      <h1>Golden Crown Takeaway</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> — £{item.price.toFixed(2)}
            {item.vegetarian && <span> 🌱</span>}
            {item.spicy && <span> 🌶️</span>}
            {item.containsNuts && <span> 🥜</span>}
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
