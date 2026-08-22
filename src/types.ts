export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  available: boolean;
  vegetarian: boolean;
  spicy: boolean;
  containsNuts: boolean;
  imageUrl: string | null;
}

export type OrderType = 'PICKUP' | 'DELIVERY';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type DeliveryZone = 'WITHIN_3_MILES' | 'OVER_3_MILES';

export interface OrderItemLine {
  id: number;
  menuItem: MenuItem;
  quantity: number;
  priceAtOrder: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  deliveryAddress: string | null;
  deliveryZone: DeliveryZone | null;
  deliveryFee: number;
  status: OrderStatus;
  createdAt: string;
  totalPrice: number;
  items: OrderItemLine[];
}
