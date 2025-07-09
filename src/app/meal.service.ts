import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../environments/environment';

export interface Meal {
  id: string;
  designation: string;
  sellingPrice: number;
  categoryLabel: string;
  image: string;
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
            categoryLabel: meal.categoryLabel,
            image: '',
          }))
        )
      );
  }

  getMeals(token: string | undefined): Observable<Meal[]> {
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
    };
    return this.http
      .post<any>(
        'https://preprod-axiobat.foliatech.app/omicron/api/Product',
        body,
        { headers }
      )
      .pipe(
        map((response) =>
          response.value.map((meal: any) => ({
            id: meal.id,
            designation: meal.designation,
            sellingPrice: meal.sellingPrice,
            categoryLabel: meal.categoryLabel,
            image: '',
          }))
        )
      );
  }

  createMeal(
    meal: Omit<Meal, 'id'>,
    token: string | undefined
  ): Observable<Meal> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      ...meal,
      productCategoryType: {
        id: 'Foliatech88',
        label: 'Repas',
        description: 'Repas',
        type: 13,
        id_html: 'Repas',
      },
      productCategoryTypeId: 'Foliatech88',
    };
    return this.http.post<Meal>(
      'https://preprod-axiobat.foliatech.app/omicron/api/Product/create',
      body,
      { headers }
    );
  }

  updateMeal(meal: Meal, token: string | undefined): Observable<Meal> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Meal>(
      `https://preprod-axiobat.foliatech.app/omicron/api/Product/update`,
      meal,
      { headers }
    );
  }

  deleteMeal(id: string, token: string | undefined): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<boolean>(
      `https://preprod-axiobat.foliatech.app/omicron/api/Product/${id}`,
      { headers }
    );
  }
}
