import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private baseUrl = environment.apiBaseUrl;

  createInvoice(invoice: any): Observable<any> {
    const token = this.loginService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.baseUrl}/Invoice/Create`, invoice, {
      headers,
    });
  }
}
