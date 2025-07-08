import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface ReceiptNumeration {
  id: string;
  prefix: string;
  nextNumber: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReceiptNumerationService {
  private http = inject(HttpClient);

  private numerations: ReceiptNumeration[] = [
    { id: 'num-1', prefix: 'REC-', nextNumber: 1001 },
    { id: 'num-2', prefix: 'INV-', nextNumber: 2001 },
  ];

  constructor() {
    const storedNumerations = localStorage.getItem('receiptNumerations');
    if (storedNumerations) {
      this.numerations = JSON.parse(storedNumerations);
    } else {
      localStorage.setItem('receiptNumerations', JSON.stringify(this.numerations));
    }
  }

  private saveNumerations() {
    localStorage.setItem('receiptNumerations', JSON.stringify(this.numerations));
  }

  getNumerations(): Observable<ReceiptNumeration[]> {
    return of(this.numerations);
  }

  createNumeration(prefix: string, nextNumber: number): Observable<ReceiptNumeration> {
    const newNumeration: ReceiptNumeration = {
      id: `num-${this.numerations.length + 1}`,
      prefix: prefix,
      nextNumber: nextNumber,
    };
    this.numerations.push(newNumeration);
    this.saveNumerations();
    return of(newNumeration);
  }

  updateNumeration(updatedNumeration: ReceiptNumeration): Observable<ReceiptNumeration> {
    const index = this.numerations.findIndex((num) => num.id === updatedNumeration.id);
    if (index > -1) {
      this.numerations[index] = updatedNumeration;
      this.saveNumerations();
      return of(updatedNumeration);
    }
    return of();
  }

  deleteNumeration(id: string): Observable<boolean> {
    const initialLength = this.numerations.length;
    this.numerations = this.numerations.filter((num) => num.id !== id);
    this.saveNumerations();
    return of(this.numerations.length < initialLength);
  }
}
