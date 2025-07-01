import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meal } from '../../types/pos.types';

@Component({
  standalone: true,
  selector: 'app-menu-grid',
  templateUrl: './menu-grid.html',
  imports: [CommonModule],
})
export class MenuGridComponent {
  meals = input.required<Meal[]>();
  loading = input.required<boolean>();
  canAddToCart = input.required<boolean>();
  orderType = input.required<'take away' | 'table'>();

  mealSelected = output<Meal>();

  onMealSelect(meal: Meal) {
    if (this.canAddToCart()) {
      this.mealSelected.emit(meal);
    }
  }

  getOverlayMessage(): string {
    return this.orderType() === 'table'
      ? 'Enter Table Number'
      : 'Select Service';
  }
}
