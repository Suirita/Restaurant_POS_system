import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { environment } from '../environments/environment';

export interface Meal {
  id: string;
  designation: string;
  sellingPrice: number;
  categoryLabel: string;
  image: string; // Changed from imageUrl to image for consistency
}

export interface Category {
  id: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

  // Mock data for demonstration (will be replaced by actual API calls)
  private meals: Meal[] = [
    {
      id: 'meal-1',
      designation: 'Spaghetti Carbonara',
      sellingPrice: 15.99,
      categoryLabel: 'Main Courses',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop&crop=center',
    },
    {
      id: 'meal-2',
      designation: 'Caesar Salad',
      sellingPrice: 9.50,
      categoryLabel: 'Appetizers',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop&crop=center',
    },
  ];

  constructor() {
    const storedMeals = localStorage.getItem('meals');
    if (storedMeals) {
      this.meals = JSON.parse(storedMeals);
    } else {
      localStorage.setItem('meals', JSON.stringify(this.meals));
    }
  }

  private saveMeals() {
    localStorage.setItem('meals', JSON.stringify(this.meals));
  }

  // Existing methods
  getCategories(token: string | undefined): Observable<Category[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<any>(`${this.baseUrl}/Configuration/Classification/type/sales`, {
        headers,
      })
      .pipe(
        map((response) =>
          response.value[4].subClassification.map((c: any) => ({
            id: c.id,
            label: c.label,
          }))
        )
      );
  }

  getMealsByCategory(
    categoryId: string,
    token: string | undefined
  ): Observable<Meal[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      PageSize: 24,
      ProdcutCategoryId: categoryId,
    };
    return this.http
      .post<any>(`${this.baseUrl}/Product`, body, { headers })
      .pipe(
        map((response) =>
          response.value.map((meal: any) => ({
            id: meal.id,
            designation: meal.designation,
            sellingPrice: meal.sellingPrice,
            categoryLabel: meal.categoryLabel,
            image: `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop&crop=center`,
          }))
        )
      );
  }

  // New CRUD methods for meals (using mock data for now)
  getMeals(): Observable<Meal[]> {
    return of(this.meals);
  }

  createMeal(meal: Omit<Meal, 'id'>): Observable<Meal> {
    const newMeal: Meal = {
      ...meal,
      id: `meal-${this.meals.length + 1}`,
    };
    this.meals.push(newMeal);
    this.saveMeals();
    return of(newMeal);
  }

  updateMeal(updatedMeal: Meal): Observable<Meal> {
    const index = this.meals.findIndex((meal) => meal.id === updatedMeal.id);
    if (index > -1) {
      this.meals[index] = updatedMeal;
      this.saveMeals();
      return of(updatedMeal);
    }
    return of();
  }

  deleteMeal(id: string): Observable<boolean> {
    const initialLength = this.meals.length;
    this.meals = this.meals.filter((meal) => meal.id !== id);
    this.saveMeals();
    return of(this.meals.length < initialLength);
  }
}
