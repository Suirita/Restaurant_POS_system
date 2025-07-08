export interface Meal {
  id: string;
  designation: string;
  sellingPrice: number;
  categoryLabel: string;
  imageUrl: string;
}

export interface CartItem extends Meal {
  quantity: number;
}

export interface Category {
  id: string;
  label: string;
}

export interface CategoryWithImage {
  id: string;
  name: string;
  image: string;
}

export interface Receipt {
  orderNumber: string;
  tableName: string;
  items: CartItem[];
  total: number;
  date: Date;
  paymentMethod: string;
  userId: string;
}

export interface UserAccount {
  userId: string;
  username: string;
  token: string;
  fullName: string;
  roleName: string;
}

export interface Table {
  name: string;
  occupied: boolean;
  userId: string | null;
}