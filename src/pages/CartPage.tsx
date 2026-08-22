import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import QuantityStepper from '../components/QuantityStepper';

export default function CartPage() {
  const {
    lines,
    removeFromCart,
    updateQuantity,
    updateNote,
    specialInstructions,
    setSpecialInstructions,
    totalPrice,
  } = useCart();

  if (lines.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-ink/60 mb-4">Your cart is empty.</p>
        <Link to="/" className="text-brand-green font-medium hover:underline">
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-3xl font-bold text-brand-green mb-6">Your Cart</h1>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 divide-y divide-black/5">
        {lines.map((line) => (
          <div key={line.item.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="font-medium text-brand-ink">{line.item.name}</p>
                <p className="text-sm text-brand-ink/60">£{line.item.price.toFixed(2)} each</p>
              </div>
              <QuantityStepper
                quantity={line.quantity}
                onChange={(quantity) => updateQuantity(line.item.id, quantity)}
              />
              <span className="w-16 text-right font-medium text-brand-ink">
                £{(line.item.price * line.quantity).toFixed(2)}
              </span>
              <button
                type="button"
                onClick={() => removeFromCart(line.item.id)}
                aria-label={`Remove ${line.item.name}`}
                className="text-brand-ink/30 hover:text-red-600 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <input
              type="text"
              value={line.note}
              onChange={(e) => updateNote(line.item.id, e.target.value)}
              placeholder="Customise this item — e.g. no spring onion, extra spicy…"
              className="mt-2 w-full text-sm rounded-md border border-black/10 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-gold placeholder:text-brand-ink/40"
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-brand-ink/70 mb-1">
          Special instructions for the whole order (optional)
        </label>
        <textarea
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          placeholder="e.g. leave at the door, ring the bell, no cutlery…"
          rows={3}
          className="w-full rounded-md border border-black/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold placeholder:text-brand-ink/40"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
        <span className="font-display text-xl font-bold text-brand-ink">
          Total: £{totalPrice.toFixed(2)}
        </span>
        <Link
          to="/checkout"
          className="bg-brand-green text-white font-medium px-6 py-2.5 rounded-full hover:bg-brand-green-dark transition-colors text-center whitespace-nowrap"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
