import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';
import { Meal } from './types/pos.types';

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

  private meals: Meal[] = [];

  constructor() {
    const storedMeals = localStorage.getItem('meals');
    if (storedMeals) {
      this.meals = JSON.parse(storedMeals);
    } else {
      localStorage.setItem('meals', JSON.stringify(this.meals));
    }
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
          response.value[6].subClassification.map((c: any) => ({
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
      Page: 1,
      PageSize: 100,
      OrderBy: 'reference',
      SortDirection: 1,
      SearchQuery: '',
      IgnorePagination: false,
      isArchived: false,
      showTarifeo: false,
      TypeProductId: 'Foliatech88',
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
            purchasePrice: meal.purchasePrice,
            totalTTC: meal.totalTTC,
            categoryId: meal.productCategoryTypeId,
            categoryLabel: meal.categoryLabel,
            image: '',
            labels: meal.labels,
          }))
        )
      );
  }

  getMeals(token: string | undefined): Observable<Meal[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      Page: 1,
      PageSize: 1000,
      OrderBy: 'reference',
      SortDirection: 1,
      TypeProductId: 'Foliatech88',
    };
    return this.http
      .post<any>(`${this.baseUrl}/Product`, body, { headers })
      .pipe(
        map((response) =>
          response.value.map((meal: any) => ({
            id: meal.id,
            designation: meal.designation,
            sellingPrice: meal.sellingPrice,
            purchasePrice: meal.purchasePrice,
            totalTTC: meal.totalTTC,
            categoryId: meal.category.id,
            categoryLabel: meal.categoryLabel,
            image: '',
            labels: meal.labels,
          }))
        )
      );
  }

  createMeal(
    meal: Omit<Meal, 'id' | 'categoryLabel'>,
    token: string | undefined
  ): Observable<Meal> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      designation: meal.designation,
      vat: 20,
      unite: 'U',
      categoryId: meal.categoryId,
      labels: meal.labels,
      purchasePrice: meal.purchasePrice,
      coefficient: 1.3,
      sellingPrice: meal.sellingPrice,
      productCategoryType: {
        id: 'Foliatech88',
        label: 'Repas',
        description: 'Repas',
        type: 5 ,
        id_html: 'Repas',
      },
      productCategoryTypeId: 'Foliatech88',
      tauxMarge: 0,
      disableSellingPrice: false,
      totalHT: meal.sellingPrice,
      totalTTC: meal.totalTTC,
      productSuppliers: [],
    };
    return this.http.post<Meal>(`${this.baseUrl}/Product/Create`, body, {
      headers,
    });
  }

  updateMeal(
    meal: Omit<Meal, 'categoryLabel'>,
    token: string | undefined
  ): Observable<Meal> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      designation: meal.designation,
      vat: 20,
      unite: 'U',
      categoryId: meal.categoryId,
      labels: meal.labels,
      purchasePrice: meal.purchasePrice,
      coefficient: 1.3,
      sellingPrice: meal.sellingPrice,
      productCategoryType: {
        id: 'Foliatech88',
        label: 'Repas',
        description: 'Repas',
        type: 5,
        id_html: 'Repas',
      },
      productCategoryTypeId: 'Foliatech88',
      tauxMarge: 0,
      disableSellingPrice: false,
      totalHT: meal.sellingPrice,
      totalTTC: meal.totalTTC,
      productSuppliers: [],
    };
    return this.http.put<Meal>(`${this.baseUrl}/Product/update`, body, {
      headers,
    });
  }

  deleteMeal(id: string, token: string | undefined): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<boolean>(`${this.baseUrl}/Product/${id}/Delete`, {
      headers,
    });
  }
}
