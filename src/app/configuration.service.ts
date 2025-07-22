import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private baseUrl = environment.apiBaseUrl;

  getUniqueReference(token: string, documentType: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(
      `${this.baseUrl}/Configuration/${documentType}/reference`,
      { headers }
    );
  }

  getCounters(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/Configuration/counter`, {
      headers,
    });
  }

  updateCounters(token: string, counters: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(
      `${this.baseUrl}/Configuration/counter`,
      { value: JSON.stringify(counters) },
      { headers }
    );
  }

  getPdfOptions(): Observable<any> {
    const token = this.loginService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/Configuration/pdf_options`, {
      headers,
    });
  }

  updatePdfOptions(options: string): Observable<any> {
    const token = this.loginService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.put<any>(
      `${this.baseUrl}/Configuration/pdf_options`,
      { value: options },
      { headers }
    );
  }
}
