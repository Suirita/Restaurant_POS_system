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
                  isPrincipale: true,
                  reference: reference,
                  status: 'in_progress',
                  note: `<div><font size="2">uptesthglihg</font></div>`,
                  purpose: `Acompte N° 1 sur devis DEVIS n°${Math.floor(
                    Math.random() * 1000000
                  )} au ${new Date().toLocaleDateString('fr-FR')}`,
                  paymentCondition: `<font size="2">Le client reconnait avoir reçu, lu, et accepté nos Conditions Générales de Ventes (CGV) lors
</font><div><font size="2">de la signature du devis.
</font></div><div><font size="2">Ces Conditions Générales de Ventes (CGV) sont jointes à chaque devis, et font partie
</font></div><div><font size="2">intégrante du devis.
</font></div><div><font size="2">____________________________________________________________________________________________________
</font></div><div><font size="2">IBAN : FR76 1460 7003 4370 1212 1241 158
</font></div><div><font size="2">BIC/SWIFT : CCBPFRPPMAR
</font></div><div><font size="2">BANQUE POPULAIRE MEDITERRANEE
</font></div><div><font size="2">Paiement chèque ou virement sous 30 jours date de facturation pour les professionnels, dès
</font></div><div><font size="2">la fin de la prestation pour les particuliers.
</font></div><div><font size="2">En vertu de la loi LME du 4 Aout 2008 qui modifie l'article441-6 du Code du Commerce, les
</font></div><div><font size="2">délais de paiement convenus ne peuvent EN AUCUN CAS dépasser 30 jours à compter de la
</font></div><div><font size="2">date d'émission de la facture. En cas de non respect de ces délais, des pénalités de retard
</font></div><div><font size="2">sont dues. Le taux d'intérêt est celui appliqué par la BCE à son opération de refinancement
</font></div><div><font size="2">la plus récente négociée de 10 points de pourcentage auxquels s'ajoutent une indemnité
</font></div><div><font size="2">forfaitaire pour frais de recouvrement de 40€. Pas d'escompte en cas de paiement anticipé.
</font></div><div><font size="2"><br></font></div>`,
                  workshopId: null,
                  labels: [
                    {
                      id: 'chneg3084mkah1',
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
                    ...client,
                    billingAddress: {
                      street: client.address,
                      city: client.city,
                      postalCode: client.postalCode,
                      countryCode: client.country,
                    },
                  },
                  typeInvoice: 2,
                  situation: 10,
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
                          description: '',
                          reference: '',
                          sellingPrice: item.product.sellingPrice,
                          purchasePrice: item.product.purchasePrice,
                          totalHT: item.product.sellingPrice * item.quantity,
                          taxValue: 0,
                          totalTTC: item.product.sellingPrice * item.quantity,
                          vat: 0,
                          unite: 'U',
                          coefficient: 0,
                          position: null,
                          isArchived: false,
                          productCategoryType: {
                            id: 'Foliatech88',
                            label: 'Repas',
                            description: 'Repas',
                            type: 5,
                          },
                          category: {
                            id: item.product.categoryId,
                            type: 1,
                            label: item.product.categoryLabel,
                            description: item.product.categoryLabel,
                            categoryType: -1,
                            isDefault: false,
                            chartAccountItem: {
                              id: '2FhdckGHLkunUFuXjV6LVw',
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
                          id_html: item.product.designation.replace(/\s/g, '_'),
                          discount: {
                            type: 2,
                            value: 0,
                          },
                          categoryId: item.product.categoryId,
                          totalFG: 0,
                          prixRevient: 0,
                          totalHtNotArrondi:
                            item.product.sellingPrice * item.quantity,
                          totalTTCNotArrondi:
                            item.product.sellingPrice * item.quantity,
                          margin: 100,
                          articleId: `article_${index}`,
                          situation: 10,
                        },
                        situationProduct: 10,
                        totalHT: item.product.sellingPrice * item.quantity,
                        totalTTC: item.product.sellingPrice * item.quantity,
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
                  responsables: [],
                  addLabelTva: '',
                  contacts: [],
                  textAcompte: {
                    designation: `Acompte de réalisation de 10.00% sur le devis DEVIS n°${Math.floor(
                      Math.random() * 1000000
                    )}`,
                    description: `Rappel total TTC Devis : ${receipt.total.toFixed(
                      2
                    )} € Total avancement de facturation : 10 % `,
                  },
                  typeFinanciere: 0,
                };
                console.log(JSON.stringify(body));
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
    pageSize: number
  ): Observable<{
    invoices: Invoice[];
    totalItems: number;
    currentPage: number;
    pagesCount: number;
  }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      Page: page,
      PageSize: pageSize,
      techniciansId: [],
      label: ['chneg3084mkah1'],
    };
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
      label: ['chneg3084mkah1'],
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
