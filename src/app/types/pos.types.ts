export interface Meal {
  id: string;
  designation: string;
  sellingPrice: number;
  categoryLabel: string;
  image: string;
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
  id: string;
  orderNumber: string;
  tableName: string;
  items: CartItem[];
  total: number;
  date: Date;
  paymentMethod: string;
  userId: string;
  client: any;
  orderDetails: any;
  status: string;
}

export interface UserAccount {
  userId: string;
  username: string;
  token: string;
  fullName: string;
  roleName: string;
  reference: string;
}

export interface Table {
  name: string;
  occupied: boolean;
  userId: string | null;
}