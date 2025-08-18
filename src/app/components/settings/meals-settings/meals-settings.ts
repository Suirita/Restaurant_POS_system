import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { KeyboardService } from '../../../keyboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from '../../../meal.service';
import { Category, Meal } from '../../../types/pos.types';
import { CategoryService } from '../../../category.service';
import {
  LucideAngularModule,
  X,
  Search,
  Plus,
  Edit,
  Trash2,
  Utensils,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-angular';
import { ReusableTable } from '../../reusable-table/reusable-table';
import { PaginationComponent } from '../../pagination/pagination';
import { CustomSelectComponent } from '../../custom-select/custom-select';

@Component({
  standalone: true,
  selector: 'app-meals-settings',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ReusableTable,
    PaginationComponent,
    CustomSelectComponent,
  ],
  templateUrl: './meals-settings.html',
})
export class MealsSettingsComponent implements OnInit {
  readonly Plus = Plus;
  readonly Search = Search;
  readonly edit = Edit;
  readonly trash2 = Trash2;
  readonly XIcon = X;
  readonly Utensils = Utensils;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronsLeft = ChevronsLeft;
  readonly ChevronRight = ChevronRight;
  readonly ChevronsRight = ChevronsRight;

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

  categoryOptions = computed(() => {
    const allCategoriesOption = { value: '', label: 'Toutes les catégories' };
    const categoryOptions = this.categories().map((c) => ({
      value: c.id,
      label: c.label,
    }));
    return [allCategoriesOption, ...categoryOptions];
  });

  formCategoryOptions = computed(() => {
    return this.categories().map((c) => ({
      value: c.id,
      label: c.label,
    }));
  });

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
  paginatedMeals = computed(() => {
    const startIndex = (this.currentPage() - 1) * 10;
    const endIndex = startIndex + 10;
    return this.filteredMeals().slice(startIndex, endIndex);
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

  tableColumns = [
    'Image',
    'Nom',
    "Prix d'achat",
    'Prix HT',
    'Prix TTC',
    'Catégorie',
    'Labels',
  ];
  tableColumnKeys = [
    'image',
    'designation',
    'purchasePrice',
    'sellingPrice',
    'totalTTC',
    'categoryLabel',
    'labels',
  ];

  ngOnInit(): void {
    this.loadMeals();
    this.loadCategories();
  }

  loadMeals(): void {
    const user = JSON.parse(localStorage.getItem('user')!); // Ensure user is not null
    this.mealService.getMeals(user.token).subscribe((meals) => {
      this.meals.set(meals);
      this.currentPage.set(1); // Reset to first page
    });
  }

  onSearchTermChange(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.currentPage.set(1);
  }

  onLabelSearchTermChange(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.labelSearchTerm.set(term);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  loadCategories(): void {
    const user = JSON.parse(localStorage.getItem('user')!); // Ensure user is not null
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
