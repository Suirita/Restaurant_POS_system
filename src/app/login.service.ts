import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserAccount } from './types/pos.types';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private http = inject(HttpClient);
  private apiUrl = 'https://preprod-axiobat.foliatech.app/omicron/api/Account/login';

  login(credentials: { userName: string; password: string }): Observable<UserAccount> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      map(response => {
        if (response && response.value && response.value.token) {
          const tokenPayload = JSON.parse(atob(response.value.token.split('.')[1]));
          return {
            userId: tokenPayload.userId,
            username: tokenPayload.userName,
            token: response.value.token,
            fullName: tokenPayload.fullName,
            roleName: tokenPayload.roleName
          };
        } else {
          throw new Error('Invalid login response');
        }
      })
    );
  }
}
