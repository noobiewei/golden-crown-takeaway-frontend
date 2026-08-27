import { useState, useEffect, useRef } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { playNewOrderChime } from '../../lib/notificationSound';
import { FREE_DRINK_LABELS, type Order, type OrderStatus } from '../../types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const BASE_TITLE = 'Golden Crown Admin — Orders';
const POLL_INTERVAL_MS = 15_000;

export default function AdminOrdersPage() {
  const { username, logout } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newOrderIds, setNewOrderIds] = useState<Set<number>>(new Set());

  // null until the very first successful fetch — lets us tell "first load"
  // apart from "a real poll", so we don't treat every order as new on open.
  const knownOrderIds = useRef<Set<number> | null>(null);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function clearBadgeOnFocus() {
      if (document.visibilityState === 'visible') {
        document.title = BASE_TITLE;
      }
    }
    document.addEventListener('visibilitychange', clearBadgeOnFocus);
    return () => document.removeEventListener('visibilitychange', clearBadgeOnFocus);
  }, []);

  function loadOrders() {
    fetch('/api/admin/orders', { credentials: 'include' })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json();
      })
      .then((data: Order[]) => {
        const currentIds = new Set(data.map((o) => o.id));

        if (knownOrderIds.current) {
          const freshlyArrived = data.filter((o) => !knownOrderIds.current!.has(o.id));
          if (freshlyArrived.length > 0) {
            playNewOrderChime();
            document.title = `🔔 (${freshlyArrived.length}) New Order${freshlyArrived.length > 1 ? 's' : ''} — ${BASE_TITLE}`;
            setNewOrderIds((current) => {
              const next = new Set(current);
              freshlyArrived.forEach((o) => next.add(o.id));
              return next;
            });
          }
        }

        knownOrderIds.current = currentIds;
        setOrders(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }

  async function updateStatus(orderId: number, status: OrderStatus) {
    const response = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      const updated: Order = await response.json();
      setOrders((current) => current.map((o) => (o.id === updated.id ? updated : o)));
      setNewOrderIds((current) => {
        const next = new Set(current);
        next.delete(orderId);
        return next;
      });
    }
  }

  if (loading) return <p className="text-center text-brand-ink/60 py-20">Loading orders...</p>;
  if (error) return <p className="text-center text-red-600 py-20">Error loading orders: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-brand-green">Orders</h1>
        <div className="flex items-center gap-4 text-sm">
          <button onClick={loadOrders} className="text-brand-green font-medium hover:underline">
            Refresh
          </button>
          <span className="text-brand-ink/60">Logged in as {username}</span>
          <button onClick={logout} className="text-brand-green font-medium hover:underline">
            Log out
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-brand-ink/60">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-xl shadow-sm border p-5 transition-colors ${
                newOrderIds.has(order.id) ? 'border-brand-gold ring-2 ring-brand-gold/40' : 'border-black/5'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-brand-ink flex items-center gap-2">
                    Order #{order.id} — {order.customerName}
                    {newOrderIds.has(order.id) && (
                      <span className="text-xs font-bold text-brand-ink bg-brand-gold rounded-full px-2 py-0.5">
                        NEW
                      </span>
                    )}
                    {order.paymentMethod === 'CASH' ? (
                      <span className="text-xs font-bold text-white bg-slate-500 rounded-full px-2 py-0.5">
                        CASH
                      </span>
                    ) : (
                      order.paymentStatus !== 'PAID' && (
                        <span className="text-xs font-bold text-white bg-red-600 rounded-full px-2 py-0.5">
                          UNPAID
                        </span>
                      )
                    )}
                  </p>
                  <p className="text-sm text-brand-ink/60">
                    {order.customerPhone} · {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-brand-ink/60">
                    {order.orderType === 'DELIVERY'
                      ? `Delivery to ${order.deliveryAddress}, ${order.deliveryPostcode}`
                      : 'Pickup'}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                  className={`text-xs font-medium rounded-full px-3 py-1.5 border-0 ${STATUS_STYLES[order.status]}`}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <ul className="divide-y divide-black/5 border-t border-black/5 pt-2">
                {order.items.map((line) => (
                  <li key={line.id} className="py-1.5 text-sm">
                    <div className="flex justify-between">
                      <span>
                        {line.menuItem.name} <span className="text-brand-ink/50">x{line.quantity}</span>
                      </span>
                      <span className="font-medium">£{(line.priceAtOrder * line.quantity).toFixed(2)}</span>
                    </div>
                    {line.note && <p className="text-brand-ink/50 text-xs">Note: {line.note}</p>}
                  </li>
                ))}
              </ul>

              {order.freeDrinkChoice && (
                <p className="text-brand-green text-xs font-medium mt-2 pt-2 border-t border-black/5">
                  🎁 Free drink: {FREE_DRINK_LABELS[order.freeDrinkChoice]}
                </p>
              )}

              {order.specialInstructions && (
                <p className="text-brand-ink/60 text-xs mt-2 pt-2 border-t border-black/5">
                  Special instructions: {order.specialInstructions}
                </p>
              )}

              <div className="flex justify-between pt-2 mt-1 border-t border-black/5 font-semibold text-sm">
                <span>Total{order.deliveryFee > 0 && ` (incl. £${order.deliveryFee.toFixed(2)} delivery)`}</span>
                <span>£{order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
