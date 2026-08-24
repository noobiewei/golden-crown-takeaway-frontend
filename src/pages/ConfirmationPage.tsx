import { useState, useEffect } from 'react';
import { useSearchParams, Navigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Order } from '../types';

const MAX_POLL_ATTEMPTS = 5;
const POLL_INTERVAL_MS = 1500;

export default function ConfirmationPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    let attempts = 0;
    let cancelled = false;

    function poll() {
      fetch(`http://localhost:8080/api/orders/by-session/${sessionId}`)
        .then((response) => {
          if (!response.ok) throw new Error(`Request failed: ${response.status}`);
          return response.json();
        })
        .then((data: Order) => {
          if (cancelled) return;
          attempts += 1;

          // Stripe already sent us here via its success_url, so payment did
          // succeed — but our webhook (the actual source of truth) might take
          // a moment to arrive and flip paymentStatus to PAID. Poll briefly
          // rather than showing a stale "unpaid" state.
          if (data.paymentStatus === 'PAID' || attempts >= MAX_POLL_ATTEMPTS) {
            setOrder(data);
            setLoading(false);
            clearCart();
          } else {
            setTimeout(poll, POLL_INTERVAL_MS);
          }
        })
        .catch((err: Error) => {
          if (cancelled) return;
          setError(err.message);
          setLoading(false);
        });
    }

    poll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  if (!sessionId) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <p className="text-center text-brand-ink/60 py-20">Confirming your payment...</p>;
  }

  if (error || !order) {
    return (
      <p className="text-center text-red-600 py-20">
        We couldn't find that order. If you were charged, please contact us with your payment reference.
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mx-auto mb-4">
        ✓
      </div>
      <h1 className="font-display text-3xl font-bold text-brand-green mb-2">Order Confirmed!</h1>
      <p className="text-brand-ink/70 mb-1">
        Thanks, {order.customerName} — your order <span className="font-semibold">#{order.id}</span> has been received.
      </p>
      {order.paymentStatus !== 'PAID' && (
        <p className="text-amber-700 text-sm mb-1">Finalizing your payment confirmation — this can take a moment.</p>
      )}
      <p className="text-brand-ink/70 mb-6">
        {order.orderType === 'DELIVERY'
          ? `We'll deliver to: ${order.deliveryAddress}`
          : "We'll have it ready for pickup."}
      </p>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-5 text-left">
        <ul className="divide-y divide-black/5">
          {order.items.map((line) => (
            <li key={line.id} className="py-2 text-sm">
              <div className="flex justify-between">
                <span>
                  {line.menuItem.name} <span className="text-brand-ink/50">x{line.quantity}</span>
                </span>
                <span className="font-medium">£{(line.priceAtOrder * line.quantity).toFixed(2)}</span>
              </div>
              {line.note && <p className="text-brand-ink/50 text-xs mt-0.5">Note: {line.note}</p>}
            </li>
          ))}
        </ul>
        {order.specialInstructions && (
          <p className="text-brand-ink/60 text-xs pt-2 mt-1 border-t border-black/5">
            Special instructions: {order.specialInstructions}
          </p>
        )}
        {order.deliveryFee > 0 && (
          <>
            <div className="flex justify-between pt-3 mt-1 border-t border-black/5 text-sm">
              <span className="text-brand-ink/70">Subtotal</span>
              <span>£{(order.totalPrice - order.deliveryFee).toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-1 text-sm">
              <span className="text-brand-ink/70">Delivery fee</span>
              <span>£{order.deliveryFee.toFixed(2)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between pt-2 mt-1 border-t border-black/5 font-display font-bold text-lg">
          <span>Total</span>
          <span>£{order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <Link to="/" className="inline-block mt-6 text-brand-green font-medium hover:underline">
        Back to menu
      </Link>
    </div>
  );
}
