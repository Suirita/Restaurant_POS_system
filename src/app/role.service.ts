import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from './types/pos.types';
import { LoginService } from './login.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private apiUrl = `${environment.apiBaseUrl}/Role`;

  getRoles(): Observable<Role[]> {
    const token = this.loginService.getToken();
    if (!token) {
      return of([]);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map((response) =>
        response.value.map((role: any) => ({
          id: role.id,
          name: role.name,
        }))
      )
    );
  }
}
