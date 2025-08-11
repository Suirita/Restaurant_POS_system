import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Armchair,
  Receipt,
  Replace,
  CreditCard,
} from 'lucide-angular';
import { CartItem, Table } from '../../types/pos.types';
import { ServiceSelectionComponent } from '../service-selection/service-selection';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.html',
  imports: [CommonModule, LucideAngularModule, ServiceSelectionComponent],
})
export class CartComponent {
  readonly ShoppingCartIcon = ShoppingCart;
  readonly TrashIcon = Trash2;
  readonly PlusIcon = Plus;
  readonly MinusIcon = Minus;
  readonly ShoppingBagIcon = ShoppingBag;
  readonly Armchair = Armchair;
  readonly Receipt = Receipt;
  readonly Replace = Replace;
  readonly CreditCard = CreditCard;

  cartItems = input.required<CartItem[]>();
  selectedCartItemId = input<string | null>(null);
  tempQuantity = input<string>('');
  total = input.required<number>();
  canAddToCart = input.required<boolean>();
  orderType = input.required<'take away' | 'table'>();
  tableNumber = input.required<string>();
  tables = input.required<Table[]>();
  isTableOccupied = input.required<boolean>();

  itemSelected = output<string>();
  itemRemoved = output<string>();
  cartCleared = output<void>();
  orderCompleted = output<void>();
  quantityIncreased = output<string>();
  quantityDecreased = output<string>();
  takeAwaySelected = output<void>();
  tableTypeSelected = output<void>();
  pay = output<void>();
  transfer = output<void>();

  displayHeader = computed(() => {
    if (this.orderType() === 'table' && this.tableNumber()) {
      return `Table: ${this.tableNumber()}`;
    } else {
      return 'Cart Details';
    }
  });

  displayIcon = computed(() => {
    if (this.orderType() === 'table' && this.tableNumber()) {
      return this.Armchair;
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

  onPay() {
    this.pay.emit();
  }

  onTransfer() {
    this.transfer.emit();
  }

  getDisplayQuantity(item: CartItem): number | string {
    return this.selectedCartItemId() === item.id
      ? this.tempQuantity() || item.quantity
      : item.quantity;
  }

  isItemBeingEdited(item: CartItem): boolean {
    return this.selectedCartItemId() === item.id;
  }
}
