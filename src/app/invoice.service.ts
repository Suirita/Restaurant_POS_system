import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Receipt, Client } from './types/pos.types';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);
  private baseURL = environment.apiBaseUrl;

  private getClientDetails(
    clientId: string,
    token: string
  ): Observable<Client> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Client>(`${this.baseURL}/Client/${clientId}`, {
      headers,
    });
  }

  createInvoice(
    receipt: Receipt,
    clientId: string,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.getClientDetails(clientId, token).pipe(
      switchMap((client) => {
        if (!client) {
          return of(null);
        }

        const body = {
          reference: `FT${new Date().getFullYear()}${Math.floor(
            Math.random() * 1000000
          )}`,
          status: 'in_progress',
          note: `<p>&#160;test&#160;</p><p><br></p><p>Pour toute question li&#233;e &#224; cette facture,</p><p>merci de nous joindre au 09 70 72 17 17 ou</p><p>par mail &#224; comptabi<font size="2">lite@foliatech.fr - - - + + +&#160;</font></p>`,
          purpose: `Situation N° 1 sur devis DV${new Date().getFullYear()}${Math.floor(
            Math.random() * 1000000
          )} au ${new Date().toLocaleDateString('fr-FR')}`,
          paymentCondition:
            `<p><font color="#1d1c1d">R&#232;glement par pr&#233;l&#232;vement trimestriel</font></p><p>Taux d'escompte : Pas d'escompte pour paiement anticip&#233;.<br></p><p>Taux de p&#233;nalit&#233; : En cas de retard d<font size="2">e paiement, application<br></font></p><p><font size="2">d'int&#233;r&#234;ts de 3fois le taux l&#233;gal (loi n&#176;2008-776 du 4 ao&#251;t 2008).<br></font></p><p><font size="2">En cas de rejet de pr&#233;l&#232;vement des frais de 25 HT vous seront factur&#233;s<br></font></p><p><font size="2">IBAN : FR76 1009 6181 3500 0695 6420 211. BIC : CMCIFRPP&#160; --- - - - + + + +</font></p>`,
          workshopId: null,
          labels: [],
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
            isDefault: true,
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
              warrantyExpirationDate: new Date(
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
            lineItems: receipt.items.map((item, index) => ({
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
                id: item.id,
                designation: item.designation,
                description: '',
                reference: '',
                sellingPrice: item.sellingPrice,
                purchasePrice: item.purchasePrice,
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
                lastStockEventDate: '0001-01-01T00:10:00+00:10',
                tarifeoPricesUpdate: null,
                ouvrages: [],
                stockIconSrc: './assets/app/imgs/stock_out.svg',
                stockTextColor: '#C51111',
                id_html: item.designation.replace(/\s/g, '_'),
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
                articleId: `article_${index}`,
                situation: 100,
              },
              situationProduct: 100,
              totalHT: item.sellingPrice * item.quantity,
              totalTTC: item.sellingPrice * item.quantity,
              comment: null,
              totalHTArrondi: item.sellingPrice * item.quantity,
            })),
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
          quotesIds: [],
          responsables: [],
          addLabelTva: '',
          contacts: [],
          textAcompte: {
            designation: `Acompte de réalisation de 100.00% sur le devis DV${new Date().getFullYear()}${Math.floor(
              Math.random() * 1000000
            )}`,
            description: `Rappel total TTC Devis : ${receipt.total.toFixed(
              2
            )}€
Total avancement de facturation : 100 % `,
          },
          typeFinanciere: 0,
        };

        return this.http.post(`${this.baseURL}/Invoice/Create`, body, {
          headers,
        });
      })
    );
  }
}
