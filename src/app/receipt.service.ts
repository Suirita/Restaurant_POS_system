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

  private buildQuoteBody(
    receipt: Receipt,
    reference: string,
    status: string = 'in_progress'
  ): any {
    const total = receipt.items.reduce(
      (sum, item) => sum + item.sellingPrice * item.quantity,
      0
    );

    const body = {
      labels: [
        {
          value: 'POS',
          id: 'chnej8fr9mo7h1',
          id_html: 'POS',
        },
      ],
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
            description: null,
            reference: null,
            sellingPrice: item.sellingPrice,
            purchasePrice: item.purchasePrice,
            totalHT: (item.purchasePrice + 5) * item.quantity,
            taxValue: 20,
            totalTTC: item.totalTTC * item.quantity,
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
              id: item.categoryId,
              type: 1,
              label: item.categoryLabel,
              description: item.categoryLabel,
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
            categoryId: item.categoryId,
            totalFG: 0,
            prixRevient: 0,
            totalHtNotArrondi: item.sellingPrice * item.quantity,
            totalTTCNotArrondi: item.sellingPrice * item.quantity,
            margin: 100,
            articleId: `${index + 1}`,
          },
          quantity: item.quantity,
          type: 1,
          remise: 0,
          isBonLivraison: false,
          id_html: item.designation,
          numeration: (index + 1).toString(),
          idPres: `${index}`,
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
        totalDu: total,
        totalHT: total,
        totalPUC: 0,
        totalTax: 0,
        generalTotalHT: total,
        typeCalcul: 1,
        showNumbering: true,
        isNumerationAuto: true,
      },
      note: null,
      paymentCondition: null,
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
      isImportedFromDPGF: false,
      calculAutomatique: {
        isSelectedCalculAcompte: true,
        pourcentage: 0,
        textCalculAutomatique: '',
      },
      status: status,
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
        creationDate: '2023-08-30T16:58:04.294644',
        priority: 3,
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
        accountingCode: '411',
        contactInformations: [
          {
            civility: 'M.',
            lastName: 'VHTPAP',
            firstName: '',
            function: '',
            email: '',
            phoneNumber: '0608908430',
            fix: null,
            landLine: '',
            comment: '',
          },
          {
            civility: 'Mme',
            lastName: 'chama',
            firstName: '',
            function: '',
            email: 'tes@test.com',
            phoneNumber: '',
            fix: null,
            landLine: '',
            comment: '',
          },
        ],
        changesHistory: [
          {
            dateAction: '2025-01-29T17:28:56.2849425+01:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2025-01-29T11:24:40.3782585+01:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2025-01-29T11:23:47.484393+01:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2025-01-28T15:19:37.8502305+01:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2025-01-28T14:57:16.6432936+01:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2025-01-28T12:02:20.3186464+01:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2025-01-28T12:02:04.9950675+01:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2025-01-28T12:01:53.6963433+01:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Priority',
                champ: 'Priority',
                valeurInitial: 'Unknown',
                valeurFinal: 'Medium',
              },
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2025-01-21T10:50:50.3158336+01:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Status',
                champ: 'Status',
                valeurInitial: '',
                valeurFinal: 'client',
              },
              {
                propName: 'CreationDate',
                champ: 'CreationDate',
                valeurInitial: '01/01/0001 00:00:00',
                valeurFinal: '30/08/2023 00:00:00',
              },
              {
                propName: 'Priority',
                champ: 'Priority',
                valeurInitial: '',
                valeurFinal: 'Unknown',
              },
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'AccountingCode',
                champ: 'AccountingCode',
                valeurInitial: '411aaaaaaaa',
                valeurFinal: '411',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2024-02-15T14:56:27.9982787+01:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2024-02-15T14:54:50.5571586+01:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2023-09-08T18:14:31.2708497+02:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 1,
            information: null,
            fields: [
              {
                propName: 'Remise',
                champ: 'Remise',
                valeurInitial: '0.0000000000000000000000000000',
                valeurFinal: '5',
              },
              {
                propName: 'Addresses',
                champ: 'Addresses',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'Materials',
                champ: 'Materials',
                valeurInitial: '',
                valeurFinal: '',
              },
              {
                propName: 'ContactInformations',
                champ: 'ContactInformations',
                valeurInitial: '',
                valeurFinal: '',
              },
            ],
            data: null,
          },
          {
            dateAction: '2023-08-30T18:58:04.2946406+02:00',
            user: {
              id: 'b019d0bb-cd97-4a1e-9770-411a2a133002',
              userName: 'user01',
              isEmpty: false,
            },
            action: 0,
            information: null,
            fields: [],
            data: null,
          },
        ],
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
      userId: receipt.userId,
      draftId: null,
      contacts: [],
      notGererByStock: false,
    };
    return body;
  }

  createReceipt(
    receipt: Receipt,
    token: string,
    uniqueReference: string,
    status: string = 'in_progress'
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = this.buildQuoteBody(receipt, uniqueReference, status);
    return this.http.post<any>(`${this.baseUrl}/Quote/Create`, body, {
      headers,
    });
  }

  saveReceipt(
    receipt: Receipt,
    token: string,
    status: string = 'in_progress'
  ): void {
    this.configurationService
      .getUniqueReference(token, 4)
      .pipe(
        switchMap((response) => {
          const uniqueReference = response;
          receipt.orderNumber = uniqueReference;
          return this.createReceipt(receipt, token, uniqueReference, status);
        })
      )
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error('Error creating receipt:', error);
        },
      });
  }

  updateReceipt(
    receipt: Receipt,
    token: string,
    status: string = 'in_progress'
  ): Observable<any> {
    return this.getReceiptDetails(receipt.id, token).pipe(
      switchMap((detailsResponse) => {
        const quoteToUpdate = detailsResponse.value;

        // Update status
        quoteToUpdate.status = status;

        // Update purpose (tableName)
        if (receipt.tableName) {
          quoteToUpdate.purpose = receipt.tableName;
        }

        if (receipt.items && receipt.items.length > 0) {
          // Update line items and totals from the local receipt
          const total = receipt.items.reduce(
            (sum, item) => sum + item.sellingPrice * item.quantity,
            0
          );

          quoteToUpdate.orderDetails.lineItems = receipt.items.map(
            (item, index) => {
              return {
                productId: item.id,
                isValid: true,
                product: {
                  id: item.id,
                  designation: item.designation,
                  description: '',
                  reference: '',
                  sellingPrice: item.sellingPrice,
                  purchasePrice: item.purchasePrice,
                  totalHT: (item.purchasePrice + 5) * item.quantity,
                  taxValue: 20,
                  totalTTC: item.totalTTC * item.quantity,
                  vat: 0,
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
                    id: item.categoryId,
                    type: 1,
                    label: item.categoryLabel,
                    description: item.categoryLabel,
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
                  totalFG: 0,
                  prixRevient: 0,
                  totalHtNotArrondi: item.sellingPrice * item.quantity,
                  totalTTCNotArrondi: item.sellingPrice * item.quantity,
                  articleId: `${index}`,
                  margin: 100,
                },
                quantity: item.quantity,
                type: 1,
                remise: 0,
                isBonLivraison: false,
                id_html: item.designation,
                numeration: (index + 1).toString(),
                idPres: `pres_${index}`,
                totalHT: item.sellingPrice * item.quantity,
                totalTTC: item.totalTTC * item.quantity,
                totalHtNotArrondi: item.sellingPrice * item.quantity,
                totalTTCNotArrondi: item.sellingPrice * item.quantity,
                arrayNumerationComplete: [
                  {
                    num: (index + 1).toString(),
                    color: '#FFFFFF',
                  },
                ],
              };
            }
          );

          // Update totals
          quoteToUpdate.orderDetails.totalHT = total;
          quoteToUpdate.orderDetails.generalTotalHT = total;
          quoteToUpdate.orderDetails.totalTTC = total;
          quoteToUpdate.orderDetails.totalDu = total;
          quoteToUpdate.totalHT = total;
          quoteToUpdate.totalTTC = total;
        }

        return this.updateQuote(quoteToUpdate, token);
      })
    );
  }

  public getReceiptDetails(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.baseUrl}/Quote/${id}`, { headers });
  }

  getReceiptByTable(
    tableName: string,
    token: string
  ): Observable<Receipt | undefined> {
    return this.getAllReceipts(token, 1, 10000, undefined, [
      'in_progress',
      'refused',
      'late',
    ]).pipe(
      map((response) => response.receipts),
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
                      image: '',
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

  deleteReceipt(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.baseUrl}/Quote/${id}/Delete`, {
      headers,
    });
  }

  deleteReceiptByOrderNumber(orderNumber: string, token: string): void {
    this.getAllReceipts(token, 1, 10000, undefined, ['in_progress'])
      .pipe(
        map((response) => response.receipts),
        switchMap((receipts) => {
          const receipt = receipts.find((r) => r.orderNumber === orderNumber);
          if (receipt && receipt.id) {
            return this.deleteReceipt(receipt.id, token);
          }
          return of(null);
        })
      )
      .subscribe({
        error: (error) =>
          console.error(
            `Error deleting receipt with order number ${orderNumber}:`,
            error
          ),
      });
  }

  public getAllReceipts(
    token: string,
    page: number,
    pageSize: number,
    userIds?: string[],
    status?: string[],
    searchQuery?: string,
    dateStart?: string,
    dateEnd?: string
  ): Observable<{
    receipts: Receipt[];
    totalItems: number;
    currentPage: number;
    pagesCount: number;
  }> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body: any = {
      Page: page,
      PageSize: pageSize,
      label: ['chnej8fr9mo7h1'],
      status: status || [],
    };
    if (userIds && userIds.length > 0) {
      body.techniciansId = userIds;
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

    return this.http.post<any>(`${this.baseUrl}/Quote`, body, { headers }).pipe(
      map((response) => {
        if (response && response.value && response.value.length > 0) {
          const receipts: Receipt[] = response.value.map(
            (quote: any) =>
              ({
                id: quote.id,
                orderNumber: quote.reference,
                tableName: quote.purpose,
                items: [], // Items will be loaded on demand
                total: parseFloat(quote.totalTTC.toFixed(2)),
                date: new Date(quote.creationDate),
                paymentMethod: '',
                userId:
                  quote.userId ||
                  (quote.responsables && quote.responsables.length > 0
                    ? quote.responsables[0]
                    : null),
                responsable: quote.responsable,
                client: quote.client,
                orderDetails: null,
                status: quote.status,
              } as Receipt)
          );
          return {
            receipts,
            totalItems: response.rowsCount,
            currentPage: response.currentPage,
            pagesCount: response.pagesCount,
          };
        }
        return {
          receipts: [],
          totalItems: 0,
          currentPage: 1,
          pagesCount: 0,
        };
      })
    );
  }

  getRevenueByCategory(
    token: string,
    dateStart?: string,
    dateEnd?: string,
    techniciansId?: string[]
  ): Observable<any> {
    const url = `${this.baseUrl}/AnalysesVentes/RepartitionParSousCategorie`;
    const body = {
      dateStart,
      dateEnd,
      techniciansId: techniciansId || [],
    };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post(url, body, { headers });
  }

  updateQuote(quote: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    if (Array.isArray(quote.responsables)) {
      quote.responsables = quote.responsables
        .filter((r: any) => r != null)
        .map((r: any) => (typeof r === 'object' ? r.id : r))
        .filter((id: any) => !!id);
    } else {
      quote.responsables = [];
    }
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
    return this.getAllReceipts(token, 1, 10000).pipe(
      map((response) => response.receipts),
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
