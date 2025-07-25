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
      .post<any>(
        `${this.baseURL}/Client`,
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

  deleteClient(id: string, token: string | undefined): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.baseURL}/Client/${id}/Delete`, { headers });
  }

  createClient(client: Client, token: string | undefined): Observable<Client> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      firstName: client.name,
      reference: `cl-${Math.floor(100000 + Math.random() * 900000)}`,
      phoneNumber: client.mobile,
      email: client.email,
      siret: client.ice,
      accountingCode: `411${client.name}`,
      addresses: [
        {
          street: client.address,
          city: client.city,
          postalCode: client.postalCode,
          countryCode: client.country,
          isDefault: true,
        },
      ],
      labels: [
        {
          value: 'POS',
          id: 'chndr1lvpr21k1',
          id_html: 'POS',
        },
      ],
    };
    return this.http.post<Client>(`${this.baseURL}/Client/Create`, body, {
      headers,
    });
  }

  updateClient(client: Client, token: string | undefined): Observable<Client> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      firstName: client.name,
      reference: `cl-${Math.floor(100000 + Math.random() * 900000)}`,
      phoneNumber: client.mobile,
      email: client.email,
      siret: client.ice,
      accountingCode: `411${client.name}`,
      addresses: [
        {
          street: client.address,
          city: client.city,
          postalCode: client.postalCode,
          countryCode: client.country,
          isDefault: true,
        },
      ],
      labels: [
        {
          value: 'POS',
          id: 'chndr1lvpr21k1',
          id_html: 'POS',
        },
      ],
    };
    return this.http.put<Client>(
      `${this.baseURL}/Client/${client.id}/Update`,
      body,
      { headers }
    );
  }
}
