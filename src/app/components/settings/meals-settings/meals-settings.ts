import { Component, OnInit, inject, signal } from '@angular/core';
import { KeyboardService } from '../../../keyboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MealService } from '../../../meal.service';
import { Category, Meal } from '../../../types/pos.types';
import { CategoryService } from '../../../category.service';
import { LucideAngularModule, Edit, Trash2 } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-meals-settings',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './meals-settings.html',
})
export class MealsSettingsComponent implements OnInit {
  readonly edit = Edit;
  readonly trash2 = Trash2;

  private mealService = inject(MealService);
  private categoryService = inject(CategoryService);
  private keyboardService = inject(KeyboardService);

  meals = signal<Meal[]>([]);
  categories = signal<Category[]>([]);
  showMealForm = signal<boolean>(false);
  editingMeal = signal<Meal | null>(null);

  newMeal: Omit<Meal, 'id'> = {
    designation: '',
    sellingPrice: 0,
    categoryLabel: '',
    image: '',
  };

  ngOnInit(): void {
    this.loadMeals();
    this.loadCategories();
  }

  loadMeals(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.mealService.getMeals(user.token).subscribe((meals) => {
      this.meals.set(meals);
    });
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
      categoryLabel: '',
      image: '',
    };
    this.showMealForm.set(true);
  }

  openEditForm(meal: Meal): void {
    this.editingMeal.set(meal);
    this.newMeal = { ...meal }; // Populate form with existing meal data
    this.showMealForm.set(true);
  }

  saveMeal(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (this.editingMeal()) {
      // Update existing meal
      this.mealService
        .updateMeal(this.editingMeal()!, user.token)
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

  openKeyboard(): void {
    this.keyboardService.openOnScreenKeyboard();
  }
}
