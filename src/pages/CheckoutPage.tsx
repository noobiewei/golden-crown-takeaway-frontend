import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface FormState {
  customerName: string;
  customerPhone: string;
  orderType: 'PICKUP' | 'DELIVERY';
  deliveryAddress: string;
}

export default function CheckoutPage() {
  const { lines, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    customerName: '',
    customerPhone: '',
    orderType: 'PICKUP',
    deliveryAddress: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0) {
    return <p>Your cart is empty — add something from the menu first.</p>;
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          orderType: form.orderType,
          deliveryAddress: form.orderType === 'DELIVERY' ? form.deliveryAddress : null,
          items: lines.map((line) => ({ menuItemId: line.item.id, quantity: line.quantity })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Order failed: ${response.status}`);
      }

      const order = await response.json();
      clearCart();
      navigate('/confirmation', { state: { order } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Checkout</h1>
      <ul>
        {lines.map((line) => (
          <li key={line.item.id}>
            {line.item.name} x{line.quantity} — £{(line.item.price * line.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <p>
        <strong>Total: £{totalPrice.toFixed(2)}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input
            type="text"
            required
            value={form.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
          />
        </label>

        <label>
          Phone
          <input
            type="tel"
            required
            value={form.customerPhone}
            onChange={(e) => handleChange('customerPhone', e.target.value)}
          />
        </label>

        <fieldset>
          <legend>Order type</legend>
          <label>
            <input
              type="radio"
              name="orderType"
              checked={form.orderType === 'PICKUP'}
              onChange={() => handleChange('orderType', 'PICKUP')}
            />
            Pickup
          </label>
          <label>
            <input
              type="radio"
              name="orderType"
              checked={form.orderType === 'DELIVERY'}
              onChange={() => handleChange('orderType', 'DELIVERY')}
            />
            Delivery
          </label>
        </fieldset>

        {form.orderType === 'DELIVERY' && (
          <label>
            Delivery address
            <input
              type="text"
              required
              value={form.deliveryAddress}
              onChange={(e) => handleChange('deliveryAddress', e.target.value)}
            />
          </label>
        )}

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Placing order...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
}
