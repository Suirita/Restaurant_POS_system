import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal, CartItem } from '../../types/pos.types';
import { LucideAngularModule, Plus, Minus } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-menu-grid',
  templateUrl: './menu-grid.html',
  imports: [CommonModule, LucideAngularModule],
})
export class MenuGridComponent {
  readonly PlusIcon = Plus;
  readonly MinusIcon = Minus;

  meals = input.required<Meal[]>();
  cart = input.required<CartItem[]>();
  loading = input.required<boolean>();
  canAddToCart = input.required<boolean>();
  orderType = input.required<'take away' | 'table'>();

  mealSelected = output<Meal>();
  quantityIncreased = output<string>();
  quantityDecreased = output<string>();
  showAllReceipts = output<void>();
  logout = output<void>();

  onMealSelect(meal: Meal) {
    if (this.canAddToCart()) {
      this.mealSelected.emit(meal);
    }
  }

  onIncreaseQuantity(mealId: string) {
    this.quantityIncreased.emit(mealId);
  }

  onDecreaseQuantity(mealId: string) {
    this.quantityDecreased.emit(mealId);
  }

  onShowAllReceipts() {
    this.showAllReceipts.emit();
  }

  onLogout() {
    this.logout.emit();
  }

  getCartItem(mealId: string): CartItem | undefined {
    return this.cart().find((item) => item.idMeal === mealId);
  }

  getOverlayMessage(): string {
    return this.orderType() === 'table'
      ? 'Enter Table Number Or Slect Take Away'
      : 'Select Service';
  }
}
