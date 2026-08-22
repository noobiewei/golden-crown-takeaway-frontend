import type { DeliveryZone, OrderType } from '../types';

// Mirrors OrderController's calculateDeliveryFee on the backend.
// This is only used to preview the total before submitting — the
// authoritative charge is always recalculated server-side on order creation.
export function estimateDeliveryFee(
  orderType: OrderType,
  zone: DeliveryZone | null,
  subtotal: number
): number {
  if (orderType !== 'DELIVERY') return 0;
  if (!zone) return 0;
  if (zone === 'OVER_3_MILES') return 3.0;
  return subtotal >= 15 ? 1.3 : 2.0;
}
