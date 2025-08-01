import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal, CartItem } from '../../types/pos.types';
import {
  LucideAngularModule,
  Plus,
  Minus,
  Receipt,
  LogOut,
  Settings,
  FileText,
  ReceiptText,
} from 'lucide-angular';

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
  readonly SettingsIcon = Settings;
  readonly ReportsIcon = FileText;
  readonly ReceiptText = ReceiptText;

  meals = input.required<Meal[]>();
  cart = input.required<CartItem[]>();
  loading = input.required<boolean>();
  canAddToCart = input.required<boolean>();
  orderType = input.required<'take away' | 'table'>();
  selectedCartItemId = input<string | null>(null);
  tempQuantity = input<string>('');
  userRole = input.required<string>();

  mealSelected = output<Meal>();
  quantityIncreased = output<string>();
  quantityDecreased = output<string>();
  showAllReceipts = output<void>();
  showAllInvoices = output<void>();
  logout = output<void>();
  itemSelected = output<string>();
  settings = output<void>();
  reports = output<void>();

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

  onShowAllInvoices() {
    this.showAllInvoices.emit();
  }

  onLogout() {
    this.logout.emit();
  }

  onSettings() {
    this.settings.emit();
  }

  onReports() {
    this.reports.emit();
  }

  getCartItem(mealId: string): CartItem | undefined {
    return this.cart().find((item) => item.id === mealId);
  }

  getOverlayMessage(): string {
    return this.orderType() === 'table'
      ? 'Entrez le numéro de table ou sélectionnez à emporter'
      : 'Sélectionnez un service';
  }

  onSelectItem(itemId: string) {
    this.itemSelected.emit(itemId);
  }

  getDisplayQuantity(item: CartItem): number | string {
    return this.selectedCartItemId() === item.id
      ? this.tempQuantity() || item.quantity
      : item.quantity;
  }

  isItemBeingEdited(item: CartItem): boolean {
    return this.selectedCartItemId() === item.id;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://placehold.co/1280x720';
  }
}
