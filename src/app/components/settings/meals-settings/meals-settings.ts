import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { KeyboardService } from '../../../keyboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from '../../../meal.service';
import { Category, Meal } from '../../../types/pos.types';
import { CategoryService } from '../../../category.service';
import {
  LucideAngularModule,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  X,
} from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-meals-settings',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './meals-settings.html',
})
export class MealsSettingsComponent implements OnInit {
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly edit = Edit;
  readonly trash2 = Trash2;
  readonly XIcon = X;

  private mealService = inject(MealService);
  private categoryService = inject(CategoryService);
  private keyboardService = inject(KeyboardService);

  meals = signal<Meal[]>([]);
  categories = signal<Category[]>([]);
  showMealForm = signal<boolean>(false);
  editingMeal = signal<Meal | null>(null);
  isInputFocused = signal<boolean>(false);

  // Filtering and Search
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');
  labelSearchTerm = signal<string>('');

  filteredMeals = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const categoryId = this.selectedCategory();
    const labelTerm = this.labelSearchTerm().toLowerCase();

    return this.meals().filter(
      (meal) =>
        meal.designation.toLowerCase().includes(term) &&
        (categoryId === '' || meal.categoryId === categoryId) &&
        (labelTerm === '' ||
          meal.labels.some((label) =>
            label.value.toLowerCase().includes(labelTerm)
          ))
    );
  });

  // Pagination
  currentPage = signal<number>(1);
  totalPages = computed(() => Math.ceil(this.filteredMeals().length / 10));
  paginatedMeals = computed(() => {
    const startIndex = (this.currentPage() - 1) * 10;
    const endIndex = startIndex + 10;
    return this.filteredMeals().slice(startIndex, endIndex);
  });
  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  newMeal: Omit<Meal, 'id' | 'categoryLabel'> = {
    designation: '',
    sellingPrice: 0,
    purchasePrice: 0,
    totalTTC: 0,
    tva: 20,
    categoryId: '',
    image: '',
    labels: [],
  };

  ngOnInit(): void {
    this.loadMeals();
    this.loadCategories();
  }

  loadMeals(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.mealService.getMeals(user.token).subscribe((meals) => {
      this.meals.set(meals);
      this.goToPage(1); // Reset to first page
    });
  }

  onSearchTermChange(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.goToPage(1);
  }

  onCategoryChange(event: Event): void {
    const categoryId = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(categoryId);
    this.goToPage(1);
  }

  onLabelSearchTermChange(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.labelSearchTerm.set(term);
    this.goToPage(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  loadCategories(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.categoryService.getCategories(user.token).subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  openCreateForm(): void {
    this.editingMeal.set(null);
    this.newMeal = {
      designation: '',
      sellingPrice: 0,
      purchasePrice: 0,
      totalTTC: 0,
      tva: 20,
      categoryId: '',
      image: '',
      labels: [],
    };
    this.showMealForm.set(true);
  }

  openEditForm(meal: Meal): void {
    this.editingMeal.set(meal);
    this.newMeal = { ...meal }; // Populate form with existing meal data
    this.showMealForm.set(true);
  }

  calculateTTC(): void {
    if (this.newMeal.sellingPrice && this.newMeal.tva) {
      this.newMeal.totalTTC =
        this.newMeal.sellingPrice * (1 + this.newMeal.tva / 100);
    }
  }

  calculateSellingPrice(): void {
    if (this.newMeal.totalTTC && this.newMeal.tva) {
      this.newMeal.sellingPrice =
        this.newMeal.totalTTC / (1 + this.newMeal.tva / 100);
    }
  }

  saveMeal(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (this.editingMeal()) {
      // Update existing meal
      this.mealService
        .updateMeal(this.newMeal as Meal, user.token)
        .subscribe(() => {
          this.loadMeals();
          this.showMealForm.set(false);
        });
    } else {
      // Create new meal
      this.mealService.createMeal(this.newMeal, user.token).subscribe(() => {
        this.loadMeals();
        this.showMealForm.set(false);
      });
    }
  }

  deleteMeal(mealId: string): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (confirm('Êtes-vous sûr de vouloir supprimer ce plat ?')) {
      this.mealService.deleteMeal(mealId, user.token).subscribe(() => {
        this.loadMeals();
      });
    }
  }

  cancelForm(): void {
    this.showMealForm.set(false);
    this.editingMeal.set(null);
  }

  addLabel(labelInput: HTMLInputElement): void {
    const labelValue = labelInput.value.trim();
    if (labelValue) {
      this.newMeal.labels.push({ value: labelValue });
      labelInput.value = '';
    }
  }

  removeLabel(index: number): void {
    this.newMeal.labels.splice(index, 1);
  }

  openKeyboard(): void {
    this.keyboardService.openOnScreenKeyboard();
  }

  closeKeyboard(): void {
    this.keyboardService.closeOnScreenKeyboard();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://placehold.co/1280x720';
  }
}
