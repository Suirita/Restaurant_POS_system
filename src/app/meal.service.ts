import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Meal {
  id: string;
  designation: string;
  sellingPrice: number;
  categoryLabel: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private baseUrl = 'https://preprod-axiobat.foliatech.app/omicron/api';

  constructor(private http: HttpClient) {}

  getCategories(token: string | undefined): Observable<Category[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get<any>(`${this.baseUrl}/Configuration/Classification/type/sales`, { headers })
      .pipe(
        map((response) =>
          response.value[4].subClassification.map((c: any) => ({ id: c.id, label: c.label }))
        )
      );
  }

  getMealsByCategory(
    categoryId: string,
    token: string | undefined
  ): Observable<Meal[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
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
            imageUrl: `https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop&crop=center`,
          }))
        )
      );
  }
}
