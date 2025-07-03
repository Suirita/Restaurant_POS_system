import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ShoppingCart,
  Trash2,
  X,
  Plus,
  Minus,
  ShoppingBag,
  HandPlatter,
} from 'lucide-angular';
import { CartItem } from '../../types/pos.types';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.html',
  imports: [CommonModule, LucideAngularModule],
})
export class CartComponent {
  readonly ShoppingCartIcon = ShoppingCart;
  readonly TrashIcon = Trash2;
  readonly XIcon = X;
  readonly PlusIcon = Plus;
  readonly MinusIcon = Minus;
  readonly ShoppingBagIcon = ShoppingBag;
  readonly HandPlatterIcon = HandPlatter;

  cartItems = input.required<CartItem[]>();
  selectedCartItemId = input<string | null>(null);
  tempQuantity = input<string>('');
  total = input.required<number>();
  canAddToCart = input.required<boolean>();
  orderType = input.required<'take away' | 'table'>();
  tableNumber = input.required<string>();

  itemSelected = output<string>();
  itemRemoved = output<string>();
  cartCleared = output<void>();
  orderCompleted = output<void>();
  quantityIncreased = output<string>();
  quantityDecreased = output<string>();

  displayHeader = computed(() => {
    if (this.orderType() === 'take away') {
      return 'Take Away';
    } else if (this.orderType() === 'table' && this.tableNumber()) {
      return `Table: ${this.tableNumber()}`;
    } else {
      return 'Cart Details';
    }
  });

  displayIcon = computed(() => {
    if (this.orderType() === 'take away') {
      return this.ShoppingBagIcon;
    } else if (this.orderType() === 'table' && this.tableNumber()) {
      return this.HandPlatterIcon;
    } else {
      return this.ShoppingCartIcon;
    }
  });

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
