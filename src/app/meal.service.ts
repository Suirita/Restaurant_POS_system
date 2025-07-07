import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strInstructions: string;
  strArea: string;
  price: number;
}

@Injectable({
  providedIn: 'root',
})
export class MealService {
  private baseUrl = 'https://www.themealdb.com/api/json/v1/1';
  private categoriesUrl =
    'https://preprod-axiobat.foliatech.app/omicron/api/Configuration/Classification/type/sales';

  constructor(private http: HttpClient) {}

  getCategories(token: string | undefined): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<any>(this.categoriesUrl, { headers })
      .pipe(
        map((response) =>
          response.value[4].subClassification.map((c: any) => c.label)
        )
      );
  }

  getMealsByCategory(category: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/filter.php?c=${category}`);
  }

  searchMeals(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/search.php?s=${query}`);
  }
}
