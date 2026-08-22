import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { lines, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (lines.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
      <ul>
        {lines.map((line) => (
          <li key={line.item.id}>
            <strong>{line.item.name}</strong> — £{line.item.price.toFixed(2)} each
            <input
              type="number"
              min={1}
              value={line.quantity}
              onChange={(e) => updateQuantity(line.item.id, Number(e.target.value))}
            />
            <span> = £{(line.item.price * line.quantity).toFixed(2)}</span>
            <button type="button" onClick={() => removeFromCart(line.item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p>
        <strong>Total: £{totalPrice.toFixed(2)}</strong>
      </p>
      <Link to="/checkout">Proceed to Checkout</Link>
    </div>
  );
}
