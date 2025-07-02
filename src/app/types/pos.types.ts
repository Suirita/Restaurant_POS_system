export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strInstructions: string;
  strArea: string;
  price: number;
}

export interface CartItem extends Meal {
  quantity: number;
}

export interface CategoryWithImage {
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
  password: string;
}

export interface Table {
  name: string;
  occupied: boolean;
  userId: string | null;
}
