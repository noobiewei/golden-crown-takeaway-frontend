import { useLocation, Navigate, Link } from 'react-router-dom';
import type { Order } from '../types';

export default function ConfirmationPage() {
  const location = useLocation();
  const order = location.state?.order as Order | undefined;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <h1>Order Confirmed!</h1>
      <p>Thanks, {order.customerName} — your order #{order.id} has been received.</p>
      <p>
        {order.orderType === 'DELIVERY'
          ? `We'll deliver to: ${order.deliveryAddress}`
          : "We'll have it ready for pickup."}
      </p>
      <ul>
        {order.items.map((line) => (
          <li key={line.id}>
            {line.menuItem.name} x{line.quantity} — £{(line.priceAtOrder * line.quantity).toFixed(2)}
          </li>
        ))}
      </ul>
      <p>
        <strong>Total: £{order.totalPrice.toFixed(2)}</strong>
      </p>
      <Link to="/">Back to menu</Link>
    </div>
  );
}
