import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Receipt, Client, Invoice } from './types/pos.types';
import { ConfigurationService } from './configuration.service';
import { ReceiptService } from './receipt.service';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);
  private configService = inject(ConfigurationService);
  private receiptService = inject(ReceiptService);
  private baseURL = environment.apiBaseUrl;

  private getClientDetails(clientId: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseURL}/Client/${clientId}`, {
      headers,
    });
  }

  createInvoice(
    receipt: Receipt,
    clientId: string,
    token: string
  ): Observable<string | null> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.receiptService.getReceiptDetails(receipt.id, token).pipe(
      switchMap((response): Observable<string | null> => {
        const quote = response.value;
        return this.getClientDetails(clientId, token).pipe(
          switchMap((clientResponse): Observable<string | null> => {
            const client = clientResponse.value;
            if (!client || !quote) {
              return of(null);
            }
            quote.client = client;
            quote.clientId = client.id;
            return this.configService.getUniqueReference(token, 6).pipe(
              switchMap((reference): Observable<string | null> => {
                const body = {
                  reference: reference,
                  status: 'in_progress',
                  note: '',
                  purpose: `Acompte N° 1 sur devis DEVIS n°${
                    receipt.id
                  } au ${new Date().toLocaleDateString('fr-FR')}`,
                  paymentCondition: '',
                  workshopId: null,
                  labels: [
                    {
                      id: 'chnej8fr9n5921',
                      value: 'POS',
                      id_html: 'POS',
                    },
                  ],
                  dueDate: new Date().toISOString().slice(0, 16),
                  creationDate: new Date().toISOString().slice(0, 16),
                  addressIntervention: {
                    designation: '',
                    department: '',
                    street: client.address,
                    complement: '',
                    city: client.city,
                    postalCode: client.postalCode,
                    countryCode: client.country,
                    note: '',
                    isDefault: true,
                  },
                  addressFacturation: {
                    designation: '',
                    department: '',
                    street: client.address,
                    complement: '',
                    city: client.city,
                    postalCode: client.postalCode,
                    countryCode: client.country,
                    note: '',
                    isDefault: false,
                  },
                  clientId: client.id,
                  client: {
                    code: null,
                    type: 'particular',
                    isProspect: 0,
                    civility: null,
                    responsableId: null,
                    name: client.name,
                    addresses: [
                      {
                        designation: '',
                        department: '',
                        street: client.address,
                        complement: '',
                        city: client.city,
                        postalCode: client.postalCode,
                        countryCode: client.country,
                        note: null,
                        isDefault: true,
                      },
                    ],
                    memos: [],
                    contactInformations: [
                      {
                        civility: '',
                        lastName: client.name.split(' ')[0],
                        firstName: client.name.split(' ')[1],
                        function: '',
                        email: client.email,
                        phoneNumber: client.phone,
                        fix: null,
                        landLine: '',
                        comment: '',
                      },
                    ],
                    billingAddress: {
                      designation: '',
                      department: '',
                      street: client.address,
                      complement: '',
                      city: client.city,
                      postalCode: client.postalCode,
                      countryCode: client.country,
                      note: null,
                      isDefault: true,
                    },
                    id: client.id,
                    reference: client.reference,
                    lastName: client.name.split(' ')[0],
                    firstName: client.name.split(' ')[1],
                    phoneNumber: client.phone,
                    fix: null,
                    landLine: null,
                    email: client.email,
                    website: null,
                    siret: client.ice,
                    intraCommunityVAT: null,
                    accountingCode: '411',
                    note: null,
                    paymentCondition: null,
                    remise: 5,
                  },
                  typeInvoice: 1,
                  situation: 100,
                  workshopName: '',
                  workshopReference: '',
                  orderDetails: {
                    globalDiscount: {
                      value: 0,
                      type: 1,
                      visible: false,
                      percenteValue: null,
                    },
                    holdbackDetails: {
                      warrantyPeriod: 12,
                      holdback: 0,
                      warrantyExpirationDate:
                        new Date(
                          new Date().setFullYear(new Date().getFullYear() + 1)
                        )
                          .toISOString()
                          .slice(0, 23) + 'Z',
                    },
                    pucDetails: {
                      value: 0,
                      addToTTC: false,
                      type: 1,
                    },
                    prorataDetails: {
                      value: 0,
                      type: 1,
                      inclueRetenu: true,
                      visible: false,
                    },
                    lineItems: quote.orderDetails.lineItems.map(
                      (item: any, index: number) => ({
                        id: null,
                        workShopId: null,
                        workShopName: null,
                        workShop: null,
                        quantity: item.quantity,
                        initialQuantity: 0,
                        type: 1,
                        impose: false,
                        numeration: (index + 1).toString(),
                        arrayNumerationComplete: [
                          {
                            num: (index + 1).toString(),
                            color: '#FFFFFF',
                          },
                        ],
                        product: {
                          id: item.product.id,
                          designation: item.product.designation,
                          description: null,
                          reference: null,
                          sellingPrice: item.product.sellingPrice,
                          purchasePrice: item.product.purchasePrice,
                          totalHT: item.product.sellingPrice * item.quantity,
                          taxValue: 20,
                          totalTTC: item.product.totalTTC * item.quantity,
                          vat: 20,
                          unite: 'U',
                          coefficient: 0,
                          position: null,
                          isArchived: false,
                          productCategoryType: {
                            id: 'Foliatech5',
                            label: 'Repas',
                            description: 'Repas',
                            type: 5,
                          },
                          category: {
                            id: item.product.categoryId,
                            label: item.product.categoryLabel,
                            description: item.product.categoryLabel,
                            categoryType: -1,
                            isDefault: false,
                            chartAccountItem: {
                              id: 'N5mMiVKZkGMqhDWTZJhtw',
                              label: 'Repas',
                              type: 5,
                              categoryType: 0,
                              code: '1111',
                              typeCode: null,
                              parentId: 'Foliatech3',
                              vatValue: 0,
                              isDefault: false,
                            },
                            subClassification: [],
                          },
                          productCTypeLabel: 'Repas',
                          categoryLabel: item.product.categoryLabel,
                          labels: [],
                          productSuppliers: [],
                          defaultSupplierId: null,
                          infosPricingLibrary: null,
                          isDisabled: false,
                          storageLocations: [],
                          isManagedByStock: false,
                          outOfStockQuantity: 0,
                          quantityInStock: 0,
                          alertQuantity: 0,
                          averagePrice: 0,
                          reservedQuantity: 0,
                          orderedQuantity: 0,
                          isOutOfStock: true,
                          isStockAlert: true,
                          lastStockEventDate: '0001-01-01T00:10:00+00:10',
                          tarifeoPricesUpdate: null,
                          ouvrages: [],
                          stockIconSrc: './assets/app/imgs/stock_out.svg',
                          stockTextColor: '#C51111',
                          id_html: item.product.designation,
                          discount: {
                            type: 2,
                            value: 0,
                          },
                          totalFG: 0,
                          prixRevient: 0,
                          totalHtNotArrondi:
                            item.product.sellingPrice * item.quantity,
                          totalTTCNotArrondi:
                            item.product.sellingPrice * item.quantity,
                          margin: 100,
                          articleId: `article_${index}`,
                          situation: 100,
                        },
                        situationProduct: 100,
                        totalHT: item.product.sellingPrice * item.quantity,
                        totalTTC: item.product.sellingPrice * item.quantity,
                        isValid: true,
                        comment: null,
                        totalHTArrondi:
                          item.product.sellingPrice * item.quantity,
                      })
                    ),
                    productsPricingDetails: {
                      totalHours: 0,
                      salesPrice: 0,
                    },
                    acompteFinanciere: {
                      value: 0,
                      amount: 0,
                    },
                    showNumbering: true,
                    isNumerationAuto: true,
                    typeNumeration: 0,
                    totalHT: receipt.total,
                    totalTax: 0,
                    generalTotalHT: receipt.total,
                    totalPUC: 0,
                    ajustementCalcul: [],
                  },
                  quotesIds: [receipt.id],
                  responsables: (() => {
                    const userString = localStorage.getItem('user');
                    if (userString) {
                      const user = JSON.parse(userString);
                      return user.userId ? [user.userId] : [];
                    }
                    return [];
                  })(),
                  addLabelTva: '',
                  contacts: [],
                  textAcompte: {
                    designation: '',
                    description: '',
                  },
                  typeFinanciere: 0,
                };
                return this.http
                  .post(`${this.baseURL}/Invoice/Create`, body, { headers })
                  .pipe(
                    switchMap(
                      (createResponse: any): Observable<string | null> => {
                        const directId =
                          createResponse?.value?.id ??
                          createResponse?.id ??
                          null;
                        if (directId) {
                          return of(directId as string);
                        }
                        // Fallback: newest invoice id
                        return this.getLatestInvoiceId(token);
                      }
                    )
                  );
              })
            );
          })
        );
      })
    );
  }

  getAllInvoices(
    token: string,
    page: number,
    pageSize: number,
    techniciansId?: string[],
    searchQuery?: string,
    dateStart?: string,
    dateEnd?: string
  ): Observable<{
    invoices: Invoice[];
    totalItems: number;
    currentPage: number;
    pagesCount: number;
  }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body: any = {
      Page: page,
      PageSize: pageSize,
    };

    if (techniciansId && techniciansId.length > 0) {
      body.techniciansId = techniciansId;
    } else {
      body.label = ['chnej8fr9n5921'];
    }
    if (searchQuery) {
      body.SearchQuery = searchQuery;
    }
    if (dateStart) {
      body.DateStart = dateStart;
    }
    if (dateEnd) {
      body.DateEnd = dateEnd;
    }

    return this.http
      .post<any>(`${this.baseURL}/Invoice`, body, { headers })
      .pipe(
        map((response: any) => {
          const mappedInvoices: Invoice[] = (response.value || []).map(
            (apiInvoice: any) => ({
              id: apiInvoice.id,
              invoiceNumber: apiInvoice.reference,
              clientName: apiInvoice.client,
              date: new Date(apiInvoice.creationDate),
              total: parseFloat(apiInvoice.totalTTC.toFixed(2)),
              responsable: apiInvoice.responsable || null,
            })
          );
          return {
            invoices: mappedInvoices,
            totalItems: response.rowsCount || 0,
            currentPage: response.currentPage || 1,
            pagesCount: response.pagesCount || 0,
          };
        })
      );
  }

  getLatestInvoiceId(token: string): Observable<string | null> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      Page: 1,
      PageSize: 1,
      techniciansId: [],
      label: ['chnej8fr9n5921'],
      OrderBy: 'creationDate',
      SortDirection: 1,
    } as any;
    return this.http
      .post<any>(`${this.baseURL}/Invoice`, body, { headers })
      .pipe(
        map((response: any): string | null => response?.value?.[0]?.id ?? null)
      );
  }

  getInvoiceDetails(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseURL}/Invoice/${id}`, { headers });
  }
}
