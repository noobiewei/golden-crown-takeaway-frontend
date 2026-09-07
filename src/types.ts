export interface Category {
  id: number;
  name: string;
  displayOrder: number;
}

export interface MenuItem {
  id: number;
  name: string;
  nameZh: string | null;
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
export type FreeDrinkChoice = 'COKE' | 'DIET_COKE' | 'TANGO_ORANGE';

export const FREE_DRINK_LABELS: Record<FreeDrinkChoice, string> = {
  COKE: 'Coke',
  DIET_COKE: 'Diet Coke',
  TANGO_ORANGE: 'Tango Orange',
};

export interface DishExtra {
  name: string;
  nameZh: string | null;
  price: number;
}

export type ExtrasCatalog = Record<string, DishExtra[]>;

export interface OrderItemExtraLine {
  id: number;
  name: string;
  nameZh: string | null;
  priceAtOrder: number;
}

export interface OrderItemLine {
  id: number;
  menuItem: MenuItem;
  quantity: number;
  priceAtOrder: number;
  note: string | null;
  noteZh: string | null;
  extras: OrderItemExtraLine[];
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  deliveryAddress: string | null;
  deliveryPostcode: string | null;
  specialInstructions: string | null;
  specialInstructionsZh: string | null;
  deliveryFee: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  orderToken: string | null;
  freeDrinkChoice: FreeDrinkChoice | null;
  createdAt: string;
  totalPrice: number;
  items: OrderItemLine[];
}
