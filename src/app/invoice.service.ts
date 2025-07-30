import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Receipt } from './types/pos.types';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);
  private baseURL = environment.apiBaseUrl;

  createInvoice(receipt: Receipt, clientId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      receiptId: receipt.id,
      clientId: clientId,
    };
    return this.http.post(`${this.baseURL}/Invoice/Create`, body, { headers });
  }
}
