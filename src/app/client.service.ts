import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Client } from './types/pos.types';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private http = inject(HttpClient);
  private baseURL = environment.apiBaseUrl;

  getClients(token: string | undefined): Observable<Client[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .post<any>(`${this.baseURL}/Client`,
        {
          Page: 1,
          PageSize: 1000,
          OrderBy: 'name',
          SortDirection: 1,
          SearchQuery: '',
          techniciansId: [],
          isProspect: 0,
          isAll: false,
          label: ['chndr1lvpr21k1'],
        },
        { headers }
      )
      .pipe(
        map((response) => {
          if (response && response.value) {
            return response.value.map((item: any) => ({
              id: item.id,
              name: item.name,
              email: item.email,
              mobile: item.phoneNumber,
              ice: item.siret,
              address: item.billingAddress.street,
              postalCode: item.billingAddress.postalCode,
              city: item.billingAddress.city,
              country: item.billingAddress.countryCode,
            }));
          }
          return [];
        })
      );
  }
}
