import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryWithImage } from '../../types/pos.types';

@Component({
  standalone: true,
  selector: 'app-category-nav',
  templateUrl: './category-nav.html',
  imports: [CommonModule],
})
export class CategoryNavComponent {
  categories = input.required<CategoryWithImage[]>();
  selectedCategory = input.required<string>();

  categorySelected = output<string>();

  onCategorySelect(category: CategoryWithImage) {
    this.categorySelected.emit(category.id);
  }
}
