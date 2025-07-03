import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../types/pos.types';
import { LucideAngularModule, Plus } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-menu-grid',
  templateUrl: './menu-grid.html',
  imports: [CommonModule, LucideAngularModule],
})
export class MenuGridComponent {
  readonly PlusIcon = Plus;

  meals = input.required<Meal[]>();
  loading = input.required<boolean>();
  canAddToCart = input.required<boolean>();
  orderType = input.required<'take away' | 'table'>();

  mealSelected = output<Meal>();
  showAllReceipts = output<void>();
  logout = output<void>();

  onMealSelect(meal: Meal) {
    if (this.canAddToCart()) {
      this.mealSelected.emit(meal);
    }
  }

  onShowAllReceipts() {
    this.showAllReceipts.emit();
  }

  onLogout() {
    this.logout.emit();
  }

  getOverlayMessage(): string {
    return this.orderType() === 'table'
      ? 'Enter Table Number Or Slect Take Away'
      : 'Select Service';
  }
}
