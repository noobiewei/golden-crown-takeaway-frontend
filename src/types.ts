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
export type PaymentStatus = 'UNPAID' | 'PAID';
export type PaymentMethod = 'CARD' | 'CASH';

export interface OrderItemLine {
  id: number;
  menuItem: MenuItem;
  quantity: number;
  priceAtOrder: number;
  note: string | null;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  deliveryAddress: string | null;
  deliveryPostcode: string | null;
  specialInstructions: string | null;
  deliveryFee: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderToken: string | null;
  createdAt: string;
  totalPrice: number;
  items: OrderItemLine[];
}
