import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal, CartItem } from '../../types/pos.types';
import { LucideAngularModule, Plus, Minus, Receipt, LogOut } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-menu-grid',
  templateUrl: './menu-grid.html',
  imports: [CommonModule, LucideAngularModule],
})
export class MenuGridComponent {
  readonly PlusIcon = Plus;
  readonly MinusIcon = Minus;
  readonly ReceiptIcon = Receipt;
  readonly LogOutIcon = LogOut;

  meals = input.required<Meal[]>();
  cart = input.required<CartItem[]>();
  loading = input.required<boolean>();
  canAddToCart = input.required<boolean>();
  orderType = input.required<'take away' | 'table'>();
  selectedCartItemId = input<string | null>(null);
  tempQuantity = input<string>('');

  mealSelected = output<Meal>();
  quantityIncreased = output<string>();
  quantityDecreased = output<string>();
  showAllReceipts = output<void>();
  logout = output<void>();
  itemSelected = output<string>();

  getSkeletonArray(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  onMealSelect(meal: Meal) {
    if (this.canAddToCart()) {
      this.mealSelected.emit(meal);
    }
  }

  onIncreaseQuantity(mealId: string, event: Event) {
    event.stopPropagation();
    this.quantityIncreased.emit(mealId);
  }

  onDecreaseQuantity(mealId: string, event: Event) {
    event.stopPropagation();
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

  onSelectItem(itemId: string) {
    this.itemSelected.emit(itemId);
  }

  getDisplayQuantity(item: CartItem): number | string {
    return this.selectedCartItemId() === item.idMeal
      ? this.tempQuantity() || item.quantity
      : item.quantity;
  }

  isItemBeingEdited(item: CartItem): boolean {
    return this.selectedCartItemId() === item.idMeal;
  }
}
