import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { estimateDeliveryFee } from '../lib/deliveryFee';
import { FREE_DRINK_LABELS, type FreeDrinkChoice, type PaymentMethod } from '../types';

const FREE_DRINK_THRESHOLD = 55;

interface FormState {
  customerName: string;
  customerPhone: string;
  orderType: 'PICKUP' | 'DELIVERY';
  deliveryAddress: string;
  deliveryPostcode: string;
  paymentMethod: PaymentMethod;
  freeDrinkChoice: FreeDrinkChoice | null;
}

const inputClasses =
  'w-full rounded-md border border-black/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold';

export default function CheckoutPage() {
  const { lines, totalPrice, specialInstructions } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    customerName: '',
    customerPhone: '',
    orderType: 'PICKUP',
    deliveryAddress: '',
    deliveryPostcode: '',
    paymentMethod: 'CARD',
    freeDrinkChoice: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (lines.length === 0) {
    return <p className="text-center text-brand-ink/60 py-20">Your cart is empty — add something from the menu first.</p>;
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const deliveryFee = estimateDeliveryFee(form.orderType, form.deliveryPostcode);
  const grandTotal = totalPrice + deliveryFee;
  const MINIMUM_DELIVERY_ORDER = 15;
  const belowDeliveryMinimum = form.orderType === 'DELIVERY' && totalPrice < MINIMUM_DELIVERY_ORDER;
  const qualifiesForFreeDrink = totalPrice >= FREE_DRINK_THRESHOLD;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          orderType: form.orderType,
          deliveryAddress: form.orderType === 'DELIVERY' ? form.deliveryAddress : null,
          deliveryPostcode: form.orderType === 'DELIVERY' ? form.deliveryPostcode : null,
          specialInstructions: specialInstructions.trim() || null,
          paymentMethod: form.paymentMethod,
          freeDrinkChoice: qualifiesForFreeDrink ? form.freeDrinkChoice : null,
          items: lines.map((line) => ({
            menuItemId: line.item.id,
            quantity: line.quantity,
            note: line.note.trim() || null,
          })),
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? `Order failed: ${response.status}`);
      }

      const { checkoutUrl, order } = await response.json();
      // Deliberately not clearing the cart here — if the customer cancels on
      // Stripe's page, they land back on /checkout with everything intact.
      // The cart only clears once ConfirmationPage confirms the order.
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        navigate(`/confirmation?order_token=${order.orderToken}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/cart" className="inline-block text-sm text-brand-ink/60 hover:text-brand-green mb-3">
        ← Back to Cart
      </Link>
      <h1 className="font-display text-3xl font-bold text-brand-green mb-6">Checkout</h1>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-5 mb-6">
        <ul className="divide-y divide-black/5">
          {lines.map((line) => (
            <li key={line.item.id} className="py-2 text-sm">
              <div className="flex justify-between">
                <span>
                  {line.item.name} <span className="text-brand-ink/50">x{line.quantity}</span>
                </span>
                <span className="font-medium">£{(line.item.price * line.quantity).toFixed(2)}</span>
              </div>
              {line.note.trim() && <p className="text-brand-ink/50 text-xs mt-0.5">Note: {line.note.trim()}</p>}
            </li>
          ))}
        </ul>
        {specialInstructions.trim() && (
          <p className="text-brand-ink/60 text-xs pt-2 mt-1 border-t border-black/5">
            Special instructions: {specialInstructions.trim()}
          </p>
        )}
        <div className="flex justify-between pt-3 mt-1 border-t border-black/5 text-sm">
          <span className="text-brand-ink/70">Subtotal</span>
          <span>£{totalPrice.toFixed(2)}</span>
        </div>
        {form.orderType === 'DELIVERY' && (
          <div className="flex justify-between pt-1 text-sm">
            <span className="text-brand-ink/70">Delivery fee</span>
            <span>{form.deliveryPostcode.trim() ? `£${deliveryFee.toFixed(2)}` : 'Enter your postcode below'}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 mt-1 border-t border-black/5 font-display font-bold text-lg">
          <span>Total</span>
          <span>£{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {belowDeliveryMinimum && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mb-6">
          Minimum order for delivery is £{MINIMUM_DELIVERY_ORDER.toFixed(2)} — add £
          {(MINIMUM_DELIVERY_ORDER - totalPrice).toFixed(2)} more, or switch to pickup.
        </p>
      )}

      <form onSubmit={handleSubmit} autoComplete="off" className="bg-white rounded-xl shadow-sm border border-black/5 p-5 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-brand-ink/70 mb-1">Name</span>
          <input
            type="text"
            required
            value={form.customerName}
            onChange={(e) => handleChange('customerName', e.target.value)}
            className={inputClasses}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-brand-ink/70 mb-1">Phone</span>
          <input
            type="tel"
            required
            value={form.customerPhone}
            onChange={(e) => handleChange('customerPhone', e.target.value)}
            className={inputClasses}
          />
        </label>

        <fieldset>
          <legend className="block text-sm font-medium text-brand-ink/70 mb-2">Order type</legend>
          <div className="flex gap-3">
            {(['PICKUP', 'DELIVERY'] as const).map((type) => (
              <label
                key={type}
                className={`flex-1 text-center cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  form.orderType === type
                    ? 'bg-brand-green text-white border-brand-green'
                    : 'border-black/10 text-brand-ink/70 hover:bg-black/5'
                }`}
              >
                <input
                  type="radio"
                  name="orderType"
                  className="sr-only"
                  checked={form.orderType === type}
                  onChange={() => handleChange('orderType', type)}
                />
                {type === 'PICKUP' ? 'Pickup' : 'Delivery'}
              </label>
            ))}
          </div>
        </fieldset>

        {form.orderType === 'DELIVERY' && (
          <>
            <label className="block">
              <span className="block text-sm font-medium text-brand-ink/70 mb-1">Delivery address</span>
              <input
                type="text"
                required
                placeholder="House number and street"
                value={form.deliveryAddress}
                onChange={(e) => handleChange('deliveryAddress', e.target.value)}
                className={inputClasses}
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-brand-ink/70 mb-1">Postcode</span>
              <input
                type="text"
                required
                placeholder="e.g. WD24 5BH"
                value={form.deliveryPostcode}
                onChange={(e) => handleChange('deliveryPostcode', e.target.value)}
                className={inputClasses}
              />
            </label>
          </>
        )}

        {qualifiesForFreeDrink && (
          <fieldset>
            <legend className="block text-sm font-medium text-brand-ink/70 mb-2">
              🎁 Your free drink (orders over £{FREE_DRINK_THRESHOLD})
            </legend>
            <div className="flex gap-3">
              {(['COKE', 'DIET_COKE', 'TANGO_ORANGE'] as const).map((drink) => (
                <label
                  key={drink}
                  className={`flex-1 text-center cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                    form.freeDrinkChoice === drink
                      ? 'bg-brand-green text-white border-brand-green'
                      : 'border-black/10 text-brand-ink/70 hover:bg-black/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="freeDrinkChoice"
                    className="sr-only"
                    checked={form.freeDrinkChoice === drink}
                    onChange={() => handleChange('freeDrinkChoice', drink)}
                  />
                  {FREE_DRINK_LABELS[drink]}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <fieldset>
          <legend className="block text-sm font-medium text-brand-ink/70 mb-2">Payment method</legend>
          <div className="flex gap-3">
            {(['CARD', 'CASH'] as const).map((method) => (
              <label
                key={method}
                className={`flex-1 text-center cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  form.paymentMethod === method
                    ? 'bg-brand-green text-white border-brand-green'
                    : 'border-black/10 text-brand-ink/70 hover:bg-black/5'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  className="sr-only"
                  checked={form.paymentMethod === method}
                  onChange={() => handleChange('paymentMethod', method)}
                />
                {method === 'CARD' ? 'Card' : `Cash on ${form.orderType === 'DELIVERY' ? 'delivery' : 'collection'}`}
              </label>
            ))}
          </div>
        </fieldset>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || belowDeliveryMinimum}
          className="w-full bg-brand-green text-white font-medium py-2.5 rounded-full hover:bg-brand-green-dark transition-colors disabled:opacity-50"
        >
          {submitting ? 'Placing order...' : `Place Order · £${grandTotal.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
