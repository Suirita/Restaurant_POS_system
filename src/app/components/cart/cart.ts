import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X, Plus, Minus } from 'lucide-angular';
import { CartItem } from '../../types/pos.types';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.html',
  imports: [CommonModule, LucideAngularModule],
})
export class CartComponent {
  readonly XIcon = X;
  readonly PlusIcon = Plus;
  readonly MinusIcon = Minus;

  cartItems = input.required<CartItem[]>();
  selectedCartItemId = input<string | null>(null);
  tempQuantity = input<string>('');
  total = input.required<number>();
  canAddToCart = input.required<boolean>();

  itemSelected = output<string>();
  itemRemoved = output<string>();
  cartCleared = output<void>();
  orderCompleted = output<void>();
  quantityIncreased = output<string>();
  quantityDecreased = output<string>();

  onSelectItem(itemId: string) {
    this.itemSelected.emit(itemId);
  }

  onRemoveItem(itemId: string, event: Event) {
    event.stopPropagation();
    this.itemRemoved.emit(itemId);
  }

  onIncreaseQuantity(itemId: string, event: Event) {
    event.stopPropagation();
    this.quantityIncreased.emit(itemId);
  }

  onDecreaseQuantity(itemId: string, event: Event) {
    event.stopPropagation();
    this.quantityDecreased.emit(itemId);
  }

  onClearCart() {
    this.cartCleared.emit();
  }

  onCompleteOrder() {
    this.orderCompleted.emit();
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
