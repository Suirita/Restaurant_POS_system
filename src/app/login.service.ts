import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { UserAccount } from './types/pos.types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiBaseUrl}/Account/login`;

  login(credentials: {
    userName: string;
    password: string;
  }): Observable<UserAccount> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      map((response) => {
        if (response && response.value && response.value.token) {
          const tokenPayload = JSON.parse(
            atob(response.value.token.split('.')[1])
          );
          return {
            userId: tokenPayload.userId,
            username: tokenPayload.userName,
            token: response.value.token,
            fullName: tokenPayload.fullName,
            roleName: tokenPayload.roleName,
            reference: '',
            phoneNumber: '',
          };
        } else {
          throw new Error('Invalid login response');
        }
      }),
      tap((user) => {
        localStorage.setItem('user', JSON.stringify(user));
      })
    );
  }

  getToken(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).token;
    }
    return null;
  }
}
