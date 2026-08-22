import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { lines, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (lines.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-ink/60 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-brand-red font-medium hover:underline">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-brand-red mb-6">Your Cart</h1>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 divide-y divide-black/5">
        {lines.map((line) => (
          <div key={line.item.id} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <p className="font-medium text-brand-ink">{line.item.name}</p>
              <p className="text-sm text-brand-ink/60">£{line.item.price.toFixed(2)} each</p>
            </div>
            <input
              type="number"
              min={1}
              value={line.quantity}
              onChange={(e) => updateQuantity(line.item.id, Number(e.target.value))}
              className="w-16 rounded-md border border-black/10 px-2 py-1 text-center"
            />
            <span className="w-20 text-right font-medium text-brand-ink">
              £{(line.item.price * line.quantity).toFixed(2)}
            </span>
            <button
              type="button"
              onClick={() => removeFromCart(line.item.id)}
              className="text-sm text-brand-ink/40 hover:text-red-600 transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <span className="font-display text-xl font-bold text-brand-ink">
          Total: £{totalPrice.toFixed(2)}
        </span>
        <Link
          to="/checkout"
          className="bg-brand-red text-white font-medium px-6 py-2.5 rounded-full hover:bg-brand-red-dark transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
