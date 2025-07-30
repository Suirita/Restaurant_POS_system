import { Injectable, inject } from '@angular/core';
import { Receipt, CartItem } from './types/pos.types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  private configurationService = inject(ConfigurationService);

  constructor() {}

  private buildQuoteBody(receipt: Receipt, reference: string): any {
    return {
      labels: [],
      reference: reference,
      multiWorkShop: false,
      creationDate: receipt.date,
      dueDate: receipt.date,
      orderDetails: {
        ajustementCalcul: [],
        globalDiscount: {
          value: 0,
          type: 1,
        },
        holdbackDetails: {
          warrantyPeriod: 12,
          holdback: 0,
          amount: 0,
          warrantyExpirationDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
        },
        primeDetails: [],
        globalVAT_Value: -1,
        pucDetails: {
          value: 0,
          addToTTC: false,
          type: 1,
        },
        prorataDetails: {
          value: 0,
          type: 2,
          inclueRetenu: true,
          visible: false,
          percenteValue: null,
        },
        lineItems: receipt.items.map((item, index) => ({
          productId: item.id,
          isValid: true,
          product: {
            id: item.id,
            designation: item.designation,
            description: '',
            reference: '',
            sellingPrice: item.sellingPrice,
            purchasePrice: 0,
            totalHT: item.sellingPrice * item.quantity,
            taxValue: 0,
            totalTTC: item.sellingPrice * item.quantity,
            vat: 0,
            unite: 'U',
            coefficient: 0,
            position: null,
            isArchived: false,
            productCategoryType: {
              id: 'Foliatech88',
              label: 'Repas',
              description: 'Repas',
              type: 13,
            },
            category: {
              id: '25c13896-7a24-47a1-ab96-a1e19b816d99',
              type: 1,
              label: item.categoryLabel,
              description: item.categoryLabel,
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
            categoryLabel: item.categoryLabel,
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
            lastStockEventDate: '0001-01-01T00:00:00+00:00',
            tarifeoPricesUpdate: null,
            ouvrages: [],
            stockIconSrc: './assets/app/imgs/stock_out.svg',
            stockTextColor: '#C51111',
            id_html: item.designation,
            discount: {
              type: 2,
              value: 0,
            },
            categoryId: '25c13896-7a24-47a1-ab96-a1e19b816d99',
            totalFG: 0,
            prixRevient: 0,
            totalHtNotArrondi: item.sellingPrice * item.quantity,
            totalTTCNotArrondi: item.sellingPrice * item.quantity,
            margin: 100,
            articleId: `article_${index}`,
          },
          quantity: item.quantity,
          type: 1,
          remise: 0,
          isBonLivraison: false,
          id_html: item.designation,
          numeration: (index + 1).toString(),
          idPres: `pres_${index}`,
          totalHT: item.sellingPrice * item.quantity,
          totalTTC: item.sellingPrice * item.quantity,
          totalHtNotArrondi: item.sellingPrice * item.quantity,
          totalTTCNotArrondi: item.sellingPrice * item.quantity,
          arrayNumerationComplete: [
            {
              num: (index + 1).toString(),
              color: '#FFFFFF',
            },
          ],
        })),
        fraisList: [],
        productsPricingDetails: {
          totalHours: 0,
          salesPrice: 0,
        },
        primeTotal: 0,
        totalDu: receipt.total,
        totalHT: receipt.total,
        totalPUC: 0,
        totalTax: 0,
        generalTotalHT: receipt.total,
        typeCalcul: 1,
        showNumbering: true,
        isNumerationAuto: true,
      },
      note: '<div><br></div>',
      paymentCondition: '',
      purpose: receipt.tableName,
      workshopId: null,
      affaireId: null,
      parentId: null,
      workshopName: '',
      workshopReference: '',
      pageCover: null,
      addLabelTva: '',
      isPrincipale: true,
      versionParentId: null,
      nameVersion: 'Version initiale',
      descriptionVersion: null,
      calculAutomatique: {
        isSelectedCalculAcompte: true,
        pourcentage: 0,
        textCalculAutomatique:
          'Si acceptation, devis à retourner signé avec un acompte de #Pourcentage#%, soit #MontantTTC# € TTC.',
      },
      status: 'in_progress',
      responsables: [receipt.userId],
      clientId: 'chlubdjubs1hu::Client::202308301858042935',
      client: {
        code: null,
        addresses: [
          {
            designation: '',
            department: '',
            street: 'Rue Casablanca',
            complement: '',
            city: 'Valence',
            postalCode: '26000',
            countryCode: 'France',
            note: null,
            isDefault: true,
          },
        ],
        materials: [],
        groupeId: null,
        type: 'particular',
        civility: null,
        remise: 5,
        validityPayment: '-1',
        responsableId: null,
        responsable: null,
        responsableName: null,
        turnover: 0,
        organisme: null,
        secteurActivite: null,
        sourceProspect: null,
        nombreEmployee: null,
        status: null,
        statusInSession: null,
        creationDate: '2023-08-30T00:00:00',
        priority: 0,
        dernierEchangeDate: '0001-01-01T00:00:00',
        isProspect: 0,
        name: 'aaaa aaaa',
        billingAddress: {
          designation: '',
          department: '',
          street: 'Rue Casablanca',
          complement: '',
          city: 'Valence',
          postalCode: '26000',
          countryCode: 'France',
          note: null,
          isDefault: true,
        },
        cpBillingAdress: '26000',
        cityBillingAdress: 'Valence',
        affaires: [],
        sessions: [],
        id: 'chlubdjubs1hu::Client::202308301858042935',
        reference: 'sco20230000057',
        firstName: 'aaaa',
        lastName: 'aaaa',
        phoneNumber: null,
        fix: null,
        landLine: null,
        email: null,
        website: null,
        siret: null,
        intraCommunityVAT: null,
        accountingCode: '411aaaaaaaa',
        contactInformations: [],
        changesHistory: [],
        memos: [],
        note: null,
        paymentCondition: null,
        modePaiement: null,
        idModePaiement: null,
        labels: [],
        id_html: 'aaaa_aaaa_sco20230000057_aaaa_aaaa',
      },
      addressIntervention: {
        designation: '',
        department: '',
        street: 'Rue Casablanca',
        complement: '',
        city: 'Valence',
        postalCode: '26000',
        countryCode: 'France',
        note: null,
        isDefault: true,
        id_html: '',
      },
      addressFacturation: {
        designation: '',
        department: '',
        street: 'Rue Casablanca',
        complement: '',
        city: 'Valence',
        postalCode: '26000',
        countryCode: 'France',
        note: null,
        isDefault: true,
        id_html: '',
      },
      draftId: null,
      contacts: [],
      notGererByStock: false,
    };
  }

  createReceipt(
    receipt: Receipt,
    token: string,
    uniqueReference: string
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = this.buildQuoteBody(receipt, uniqueReference);
    return this.http.post<any>(`${this.baseUrl}/Quote/Create`, body, {
      headers,
    });
  }

  saveReceipt(receipt: Receipt, token: string): void {
    this.configurationService
      .getUniqueReference(token, 4)
      .pipe(
        switchMap((response) => {
          const uniqueReference = response;
          receipt.orderNumber = uniqueReference;
          return this.createReceipt(receipt, token, uniqueReference);
        })
      )
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error('Error creating receipt:', error);
        },
      });
  }

  updateReceipt(receipt: Receipt, token: string): Observable<any> {
    const body = this.buildQuoteBody(receipt, receipt.orderNumber);
    body.id = receipt.id;
    return this.updateQuote(body, token);
  }

  getReceipts(userId: string, token: string): Observable<Receipt[]> {
    return this.getAllReceipts(token, userId, ['in_progress']);
  }

  public getReceiptDetails(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/Quote/${id}`, { headers });
  }

  getReceiptByTable(
    tableName: string,
    token: string
  ): Observable<Receipt | undefined> {
    return this.getAllReceipts(token, undefined, ['in_progress']).pipe(
      switchMap((receipts) => {
        const receipt = receipts.find((r) => r.tableName === tableName);
        if (receipt && receipt.id) {
          return this.getReceiptDetails(receipt.id, token).pipe(
            map((detailsResponse) => {
              const quoteDetails = detailsResponse.value;
              if (
                quoteDetails &&
                quoteDetails.orderDetails &&
                quoteDetails.orderDetails.lineItems
              ) {
                const lineItems: CartItem[] =
                  quoteDetails.orderDetails.lineItems.map((item: any) => {
                    const product = item.product;
                    return {
                      id: product.id,
                      designation: product.designation,
                      sellingPrice: product.sellingPrice,
                      purchasePrice: product.purchasePrice || 0,
                      totalTTC: item.totalTTC,
                      tva: product.vat || 0,
                      categoryId: product.categoryId,
                      categoryLabel: product.categoryLabel,
                      image: '', // Image is not in the response, default to empty string
                      quantity: item.quantity,
                      labels: product.labels || [],
                    };
                  });

                return {
                  ...receipt,
                  items: lineItems,
                  total: quoteDetails.totalTTC,
                } as Receipt;
              }
              return receipt; // Return basic receipt if details are not available
            })
          );
        } else {
          return of(undefined);
        }
      })
    );
  }

  deleteReceiptByOrderNumber(orderNumber: string): void {
    console.log(`Deleting receipt with order number: ${orderNumber}`);
  }

  public getAllReceipts(
    token: string,
    userId?: string,
    status?: string[]
  ): Observable<Receipt[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body: any = {
      Page: 1,
      PageSize: 100,
    };
    if (userId) {
      body.techniciansId = [userId];
    }
    if (status) {
      body.status = status;
    }
    return this.http.post<any>(`${this.baseUrl}/Quote`, body, { headers }).pipe(
      map((response) => {
        if (response && response.value) {
          return response.value.map(
            (quote: any) =>
              ({
                id: quote.id,
                orderNumber: quote.reference,
                tableName: quote.purpose,
                items: [],
                total: quote.totalTTC,
                date: new Date(quote.creationDate),
                paymentMethod: '',
                userId:
                  quote.userId ||
                  (quote.responsables && quote.responsables.length > 0
                    ? quote.responsables[0]
                    : null),
                client: quote.client,
                orderDetails: null, // Not available in this response
                status: quote.status,
              } as Receipt)
          );
        }
        return [];
      })
    );
  }

  updateQuote(quote: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(
      `${this.baseUrl}/Quote/${quote.id}/Update`,
      quote,
      {
        headers,
      }
    );
  }

  getQuoteByTable(
    tableName: string,
    token: string
  ): Observable<any | undefined> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.getAllReceipts(token).pipe(
      switchMap((receipts) => {
        const receipt = receipts.find((r) => r.tableName === tableName);
        if (receipt) {
          const body = { id: receipt.id };
          return this.http
            .post<any>(`${this.baseUrl}/Quote`, body, {
              headers,
            })
            .pipe(
              map((response) => {
                if (response && response.value && response.value.length > 0) {
                  return response.value[0];
                }
                return undefined;
              })
            );
        } else {
          return of(undefined);
        }
      })
    );
  }
}
