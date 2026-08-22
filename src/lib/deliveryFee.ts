import type { OrderType } from '../types';

// Mirrors OrderController's calculateDeliveryFee on the backend.
// This is only used to preview the fee before submitting — the
// authoritative charge is always recalculated server-side on order creation.
const HIGHER_FEE_POSTCODE_PREFIXES = [
  'WD233', 'WD231', 'WD234',
  'WD194', 'WD196', 'WD197',
  'WD33', 'WD31',
  'AL2',
  'WD50',
  'WD4',
];

const STANDARD_DELIVERY_FEE = 1.3;
const HIGHER_DELIVERY_FEE = 3.0;

export function estimateDeliveryFee(orderType: OrderType, postcode: string): number {
  if (orderType !== 'DELIVERY') return 0;
  if (!postcode.trim()) return 0;

  const normalized = postcode.toUpperCase().replace(/\s/g, '');
  const isHigherFeeArea = HIGHER_FEE_POSTCODE_PREFIXES.some((prefix) => normalized.startsWith(prefix));

  return isHigherFeeArea ? HIGHER_DELIVERY_FEE : STANDARD_DELIVERY_FEE;
}
