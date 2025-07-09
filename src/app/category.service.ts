import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { Category } from './types/pos.types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;

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

  createCategory(
    label: string,
    token: string | undefined
  ): Observable<Category> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      label: label,
      type: 'sales',
    };
    return this.http.post<Category>(
      `${this.baseUrl}/Configuration/Classification`,
      body,
      { headers }
    );
  }

  updateCategory(
    category: Category,
    token: string | undefined
  ): Observable<Category> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Category>(
      `${this.baseUrl}/Configuration/Classification`,
      category,
      { headers }
    );
  }

  deleteCategory(id: string, token: string | undefined): Observable<boolean> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<boolean>(
      `${this.baseUrl}/Configuration/Classification/${id}`,
      { headers }
    );
  }
}