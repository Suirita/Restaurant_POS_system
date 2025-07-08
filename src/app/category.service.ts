import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Category } from './types/pos.types';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = 'api/categories';

  private categories: Category[] = [
    { id: 'cat-1', label: 'Appetizers' },
    { id: 'cat-2', label: 'Main Courses' },
    { id: 'cat-3', label: 'Desserts' },
    { id: 'cat-4', label: 'Drinks' },
  ];

  constructor() {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      this.categories = JSON.parse(storedCategories);
    } else {
      localStorage.setItem('categories', JSON.stringify(this.categories));
    }
  }

  private saveCategories() {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  createCategory(label: string): Observable<Category> {
    const newCategory: Category = {
      id: `cat-${this.categories.length + 1}`,
      label: label,
    };
    this.categories.push(newCategory);
    this.saveCategories();
    return of(newCategory);
  }

  updateCategory(updatedCategory: Category): Observable<Category> {
    const index = this.categories.findIndex((cat) => cat.id === updatedCategory.id);
    if (index > -1) {
      this.categories[index] = updatedCategory;
      this.saveCategories();
      return of(updatedCategory);
    }
    return of();
  }

  deleteCategory(id: string): Observable<boolean> {
    const initialLength = this.categories.length;
    this.categories = this.categories.filter((cat) => cat.id !== id);
    this.saveCategories();
    return of(this.categories.length < initialLength);
  }
}
