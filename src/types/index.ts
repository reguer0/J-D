export interface Card {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  condition: 'new' | 'used' | 'mint' | 'good' | 'poor';
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  category: 'pokemon' | 'yugioh' | 'magic' | 'other';
  rarity: string;
  set: string;
}

export interface CartItem {
  card: Card;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}
