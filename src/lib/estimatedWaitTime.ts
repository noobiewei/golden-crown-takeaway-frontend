import type { OrderType } from '../types';

// Sunday-Thursday = normal timing, Friday-Saturday = busier timing.
export function getEstimatedWaitTime(orderType: OrderType, createdAt: string): string {
  const day = new Date(createdAt).getDay(); // 0 = Sunday, 6 = Saturday
  const isBusyDay = day === 5 || day === 6;

  if (orderType === 'PICKUP') {
    return isBusyDay ? '20-30 minutes' : '10-15 minutes';
  }
  return isBusyDay ? '1 hour to 1 hour 15 minutes' : '45 minutes to 1 hour';
}
