import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../category.service';
import { Category } from '../../../types/pos.types';

@Component({
  standalone: true,
  selector: 'app-categories-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-settings.html',
})
export class CategoriesSettingsComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  showCategoryForm = signal<boolean>(false);
  editingCategory = signal<Category | null>(null);

  newCategoryLabel: string = '';

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  openCreateForm(): void {
    this.editingCategory.set(null);
    this.newCategoryLabel = '';
    this.showCategoryForm.set(true);
  }

  openEditForm(category: Category): void {
    this.editingCategory.set(category);
    this.newCategoryLabel = category.label; // Populate form with existing category label
    this.showCategoryForm.set(true);
  }

  saveCategory(): void {
    if (this.editingCategory()) {
      // Update existing category
      const updatedCategory: Category = {
        ...this.editingCategory()!,
        label: this.newCategoryLabel,
      };
      this.categoryService.updateCategory(updatedCategory).subscribe(() => {
        this.loadCategories();
        this.showCategoryForm.set(false);
      });
    } else {
      // Create new category
      this.categoryService.createCategory(this.newCategoryLabel).subscribe(() => {
        this.loadCategories();
        this.showCategoryForm.set(false);
      });
    }
  }

  deleteCategory(categoryId: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(categoryId).subscribe(() => {
        this.loadCategories();
      });
    }
  }

  cancelForm(): void {
    this.showCategoryForm.set(false);
    this.editingCategory.set(null);
  }
}
