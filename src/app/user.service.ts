import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserAccount } from './types/pos.types';
import { LoginService } from './login.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private loginService = inject(LoginService);
  private apiUrl = `${environment.apiBaseUrl}/Account`;
  private fileApiUrl = `${environment.apiBaseUrl}/File`;

  getUsers(): Observable<UserAccount[]> {
    const token = this.loginService.getToken();
    if (!token) {
      return of([]);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      Page: 1,
      PageSize: 1000,
      showAllUsers: true,
      label: ['chndr1lvpq3321'],
    };
    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map((response) =>
        response.value.map((user: any) => ({
          userId: user.id,
          username: user.userName,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          roleName: user.roleName,
          image: user.image,
          token: '', // Token is not returned by this endpoint
        }))
      )
    );
  }

  getFile(fileId: string): Observable<any> {
    const token = this.loginService.getToken();
    if (!token) {
      return of(null);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.fileApiUrl}/${fileId}`, { headers });
  }

  saveFile(image: { id: string; base64: string }): Observable<any> {
    const token = this.loginService.getToken();
    if (!token) {
      return of(null);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.fileApiUrl}/save`, [image], { headers });
  }

  createUser(user: any): Observable<UserAccount> {
    const token = this.loginService.getToken();
    if (!token) {
      return of();
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const roleId =
      user.roleName === 'Direction'
        ? 'bb980f79-df6b-468c-b05a-8422b1fc40e0'
        : '133cd9c0-b5e0-4c1a-b1f1-880b666bdc30';
    const body = {
      userName: user.username,
      password: 'demodemo',
      firstName: user.fullName.split(' ')[0],
      lastName: user.fullName.split(' ')[1] || user.fullName.split(' ')[0],
      reference: user.reference,
      coutUser: {
        userCost: 49,
        userCostPerDay: 392,
        nbrHourPerDay: '08:00',
        nbrHourPerSupp: '00:00',
        userCostExtra: 0,
        userCostPerDayExtra: 0,
      },
      statut: true,
      email: '',
      phoneNumber: user.phoneNumber || '',
      memorySize: 0,
      roleId: roleId,
      labels: [{ value: 'POS', id: 'chndr1lvpq3321', id_html: 'POS' }],
      image: user.image ? { fileId: user.image.fileId } : null,
      typeUser: 'Normal',
      licenceUser: 0,
      permissions: [],
    };
    return this.http.post<UserAccount>(`${this.apiUrl}/Create`, body, {
      headers,
    });
  }

  updateUser(user: UserAccount): Observable<UserAccount> {
    const token = this.loginService.getToken();
    if (!token) {
      return of();
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const roleId =
      user.roleName === 'Direction'
        ? 'bb980f79-df6b-468c-b05a-8422b1fc40e0'
        : '133cd9c0-b5e0-4c1a-b1f1-880b666bdc30';
    const body = {
      userName: user.username,
      password: 'demodemo',
      firstName: user.fullName.split(' ')[0],
      lastName: user.fullName.split(' ')[1] || user.fullName.split(' ')[0],
      reference: user.reference,
      coutUser: {
        userCost: 49,
        userCostPerDay: 392,
        nbrHourPerDay: '08:00',
        nbrHourPerSupp: '00:00',
        userCostExtra: 0,
        userCostPerDayExtra: 0,
      },
      statut: true,
      email: '',
      phoneNumber: user.phoneNumber || '',
      memorySize: 0,
      roleId: roleId,
      labels: [{ value: 'POS', id: 'chndr1lvpq3321', id_html: 'POS' }],
      image: user.image ? { fileId: user.image.fileId } : null,
      typeUser: 'Normal',
      licenceUser: 0,
      permissions: [],
    };
    return this.http.put<UserAccount>(
      `${this.apiUrl}/${user.userId}/Update`,
      body,
      {
        headers,
      }
    );
  }

  deleteUser(userId: string): Observable<any> {
    const token = this.loginService.getToken();
    if (!token) {
      return of(null);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/${userId}/Delete`, { headers });
  }
}
