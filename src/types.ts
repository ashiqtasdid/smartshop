export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category?: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  name: string;
  comment: string;
  date: string;
  rating: number;
}

export interface AppState {
  cart: CartItem[];
  couponApplied: boolean;
  balance: number;
}
