import { useLocation, Navigate, Link } from 'react-router-dom';
import type { Order } from '../types';

export default function ConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  if (!order) {
    return <Navigate to="/" replace />;
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
      <p className="text-brand-ink/70 mb-6">
        {order.orderType === 'DELIVERY'
          ? `We'll deliver to: ${order.deliveryAddress}`
          : "We'll have it ready for pickup."}
      </p>

      <div className="bg-white rounded-xl shadow-sm border border-black/5 p-5 text-left">
        <ul className="divide-y divide-black/5">
          {order.items.map((line) => (
            <li key={line.id} className="flex justify-between py-2 text-sm">
              <span>
                {line.menuItem.name} <span className="text-brand-ink/50">x{line.quantity}</span>
              </span>
              <span className="font-medium">£{(line.priceAtOrder * line.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
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
