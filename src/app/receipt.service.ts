import { Injectable, inject } from '@angular/core';
import { Receipt } from './types/pos.types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private readonly STORAGE_KEY = 'receipts';
  private http = inject(HttpClient);
  private baseUrl = environment.apiBaseUrl;
  private configurationService = inject(ConfigurationService);

  constructor() {}

  createReceipt(
    receipt: Receipt,
    token: string,
    uniqueReference: string
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      labels: [],
      reference: uniqueReference,
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
      purpose: null,
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
      userId: receipt.userId,
      draftId: null,
      contacts: [],
      notGererByStock: false,
    };
    return this.http.post<any>(`${this.baseUrl}/Quote/Create`, body, {
      headers,
    });
  }

  saveReceipt(receipt: Receipt, token: string): void {
    this.configurationService
      .getUniqueReference(token)
      .pipe(
        switchMap((response) => {
          const uniqueReference = response.value;
          receipt.orderNumber = uniqueReference;
          return this.createReceipt(receipt, token, uniqueReference);
        })
      )
      .subscribe({
        next: () => {
          const allReceipts = this.getAllReceipts();
          allReceipts.push(receipt);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allReceipts));
        },
        error: (error) => {
          console.error('Error creating receipt:', error);
        },
      });
  }


  getReceipts(userId: string): Receipt[] {
    const allReceipts = this.getAllReceipts();
    return allReceipts.filter(receipt => receipt.userId === userId);
  }

  getReceiptByTable(tableName: string): Receipt | undefined {
    const allReceipts = this.getAllReceipts();
    return allReceipts.find(receipt => receipt.tableName === tableName);
  }

  deleteReceiptByTable(tableName: string): void {
    let allReceipts = this.getAllReceipts();
    allReceipts = allReceipts.filter(receipt => receipt.tableName !== tableName);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allReceipts));
  }

  deleteReceiptByOrderNumber(orderNumber: string): void {
    let allReceipts = this.getAllReceipts();
    allReceipts = allReceipts.filter(
      (receipt) => receipt.orderNumber !== orderNumber
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allReceipts));
  }

  updateReceipt(updatedReceipt: Receipt): void {
    const allReceipts = this.getAllReceipts();
    const index = allReceipts.findIndex(
      (r) => r.orderNumber === updatedReceipt.orderNumber
    );
    if (index !== -1) {
      allReceipts[index] = updatedReceipt;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allReceipts));
    }
  }

  public getAllReceipts(): Receipt[] {
    const receiptsJson = localStorage.getItem(this.STORAGE_KEY);
    return receiptsJson ? JSON.parse(receiptsJson) : [];
  }
}
