and remove the quote status editing when creating an ivoice and change the invoice creation body to look like this:

```json
{
  "reference": "FACTURE N°58964",
  "status": "in_progress",
  "note": "<div><font size=\"2\">uptesthglihg</font></div>",
  "purpose": "Acompte N° 1 sur devis DEVIS n°111330 au 31-07-2025",
  "paymentCondition": "<font size=\"2\">Le client reconnait avoir reçu, lu, et accepté nos Conditions Générales de Ventes (CGV) lors\n</font><div><font size=\"2\">de la signature du devis.\n</font></div><div><font size=\"2\">Ces Conditions Générales de Ventes (CGV) sont jointes à chaque devis, et font partie\n</font></div><div><font size=\"2\">intégrante du devis.\n</font></div><div><font size=\"2\">____________________________________________________________________________________________________\n</font></div><div><font size=\"2\">IBAN : FR76 1460 7003 4370 1212 1241 158\n</font></div><div><font size=\"2\">BIC/SWIFT : CCBPFRPPMAR\n</font></div><div><font size=\"2\">BANQUE POPULAIRE MEDITERRANEE\n</font></div><div><font size=\"2\">Paiement chèque ou virement sous 30 jours date de facturation pour les professionnels, dès\n</font></div><div><font size=\"2\">la fin de la prestation pour les particuliers.\n</font></div><div><font size=\"2\">En vertu de la loi LME du 4 Aout 2008 qui modifie l'article441-6 du Code du Commerce, les\n</font></div><div><font size=\"2\">délais de paiement convenus ne peuvent EN AUCUN CAS dépasser 30 jours à compter de la\n</font></div><div><font size=\"2\">date d'émission de la facture. En cas de non respect de ces délais, des pénalités de retard\n</font></div><div><font size=\"2\">sont dues. Le taux d'intérêt est celui appliqué par la BCE à son opération de refinancement\n</font></div><div><font size=\"2\">la plus récente négociée de 10 points de pourcentage auxquels s'ajoutent une indemnité\n</font></div><div><font size=\"2\">forfaitaire pour frais de recouvrement de 40€. Pas d'escompte en cas de paiement anticipé.\n</font></div><div><font size=\"2\"><br></font></div>",
  "workshopId": "chlubdjubs1hu::ConstructionWorkshops::202507291744338822",
  "labels": [],
  "dueDate": "2025-07-31T15:33",
  "creationDate": "2025-07-31T15:33",
  "addressIntervention": {
    "designation": "",
    "department": "",
    "street": "jjjjjjjjjjjjjjjjjjjjj",
    "complement": "",
    "city": "jjjjjjjjjjjjjjjjjjjjjjj",
    "postalCode": "",
    "countryCode": "",
    "note": "",
    "isDefault": true
  },
  "addressFacturation": {
    "designation": "",
    "department": "",
    "street": "jjjjjjjjjjjjjjjjjjjjj",
    "complement": "",
    "city": "jjjjjjjjjjjjjjjjjjjjjjj",
    "postalCode": "",
    "countryCode": "",
    "note": "",
    "isDefault": false
  },
  "clientId": "chlubdjubs1hu::Client::2024120213451021742",
  "client": {
    "code": null,
    "type": "particular",
    "isProspect": 0,
    "civility": "Mme",
    "responsableId": null,
    "name": "Mme 0LES GALERIES LAPAYETTE test fdfd",
    "addresses": [
      {
        "designation": "",
        "department": "",
        "street": "jjjjjjjjjjjjjjjjjjjjj",
        "complement": "",
        "city": "jjjjjjjjjjjjjjjjjjjjjjj",
        "postalCode": "",
        "countryCode": "",
        "note": "",
        "isDefault": false
      },
      {
        "designation": "",
        "department": "",
        "street": "hhhhhhhhhhhhhhhh",
        "complement": "",
        "city": "hhhhhhhhhhhhhhhhhh",
        "postalCode": "",
        "countryCode": "",
        "note": "",
        "isDefault": false
      },
      {
        "designation": "",
        "department": "",
        "street": "azezaeza",
        "complement": "",
        "city": "ezaezaez",
        "postalCode": "",
        "countryCode": "",
        "note": "",
        "isDefault": false
      },
      {
        "designation": "",
        "department": "",
        "street": "azdazdzadza",
        "complement": "",
        "city": "dzadaz",
        "postalCode": "",
        "countryCode": "",
        "note": "",
        "isDefault": false
      },
      {
        "designation": "",
        "department": "",
        "street": "dazdzadazdaz",
        "complement": "",
        "city": "dazdazdza",
        "postalCode": "",
        "countryCode": "",
        "note": "",
        "isDefault": false
      },
      {
        "designation": "rerer",
        "department": null,
        "street": "erer",
        "complement": "erer",
        "city": "erer",
        "postalCode": null,
        "countryCode": null,
        "note": null,
        "isDefault": false
      }
    ],
    "memos": [],
    "contactInformations": null,
    "billingAddress": {
      "designation": "",
      "department": "",
      "street": "jjjjjjjjjjjjjjjjjjjjj",
      "complement": "",
      "city": "jjjjjjjjjjjjjjjjjjjjjjj",
      "postalCode": "",
      "countryCode": "",
      "note": "",
      "isDefault": false
    },
    "id": "chlubdjubs1hu::Client::2024120213451021742",
    "reference": "PR-2024032",
    "firstName": "0LES GALERIES LAPAYETTE test",
    "lastName": "fdfd",
    "phoneNumber": "0602030405",
    "fix": null,
    "landLine": null,
    "email": "galeriespayette@demo.com",
    "website": null,
    "siret": null,
    "intraCommunityVAT": null,
    "accountingCode": "411000LESGALERIESLAPAYETTEtest",
    "note": null,
    "paymentCondition": null,
    "remise": 0
  },
  "typeInvoice": 2,
  "situation": 10,
  "workshopName": "ddddddddddd",
  "workshopReference": "CH-1202500116",
  "orderDetails": {
    "globalDiscount": {
      "value": 0,
      "type": 1,
      "visible": false,
      "percenteValue": null
    },
    "holdbackDetails": {
      "warrantyPeriod": 12,
      "holdback": 0,
      "warrantyExpirationDate": "2026-07-31T14:33:20.824Z"
    },
    "pucDetails": {
      "value": 0,
      "addToTTC": false,
      "type": 1
    },
    "prorataDetails": {
      "value": 0,
      "type": 1,
      "inclueRetenu": true,
      "visible": false
    },
    "lineItems": [
      {
        "id": null,
        "workShopId": null,
        "workShopName": null,
        "workShop": null,
        "quantity": 1,
        "initialQuantity": 0,
        "type": 1,
        "impose": false,
        "numeration": "1",
        "arrayNumerationComplete": [
          {
            "num": "1",
            "color": "#FFFFFF"
          }
        ],
        "product": {
          "id": "chlubdjubs1hu::Product::202507241906193050",
          "designation": "Disjoncteur T4L250 3P FF PR221-I 100A V",
          "description": "Disjoncteur TMAX T4L 250 1000V CA fixe tripolaire avec prises avant pour vable Cu et Déclencheur électronique en AC PR221DS-I R 100",
          "reference": "054506",
          "sellingPrice": 4783.28,
          "frais": 35,
          "prixRevient": 6457.428,
          "purchasePrice": 4783.28,
          "totalHT": 4783.28,
          "taxValue": 956.656,
          "totalTTC": 5739.936,
          "vat": 20,
          "unite": "U",
          "coefficient": 1,
          "coefficientNet": 1,
          "position": null,
          "isArchived": false,
          "productCategoryType": {
            "id": "Foliatech1",
            "label": "Fourniture",
            "description": "Fourniture",
            "type": 8
          },
          "category": {
            "id": "Foliatech47",
            "type": 1,
            "label": "Produit fini",
            "description": "Produit fini",
            "categoryType": -1,
            "isDefault": false,
            "chartAccountItem": null,
            "chartAccountItemSalses": null,
            "chartAccountItemExpenses": null,
            "subClassification": []
          },
          "productCTypeLabel": "Fourniture",
          "categoryLabel": "Produit fini",
          "labels": [],
          "productSuppliers": [
            {
              "supplierId": "chlubdjubs1hu::Supplier::202412261509549563",
              "supplier": {
                "id": "chlubdjubs1hu::Supplier::202412261509549563",
                "reference": "",
                "fullName": " ",
                "firstName": "",
                "lastName": null
              },
              "price": 0,
              "isDefault": false,
              "reference": "",
              "barCode": "8015644556082"
            },
            {
              "supplierId": "chlubdjubs1hu::Supplier::202507091650177846",
              "supplier": {
                "id": "chlubdjubs1hu::Supplier::202507091650177846",
                "reference": "SON01",
                "fullName": "SON01 ",
                "firstName": "SON01",
                "lastName": null
              },
              "price": 4783.28,
              "isDefault": true,
              "reference": "",
              "barCode": "8015644556082"
            }
          ],
          "defaultSupplierId": "chlubdjubs1hu::Supplier::202507091650177846",
          "infosPricingLibrary": {
            "libraryType": "Tarifeo",
            "value": {
              "IdTarifTarifeo": "121",
              "CodeArticle": "054506",
              "Designation": "Disjoncteur T4L250 3P FF PR221-I 100A V"
            }
          },
          "isDisabled": false,
          "storageLocations": [],
          "isManagedByStock": false,
          "outOfStockQuantity": 0,
          "quantityInStock": 0,
          "alertQuantity": 0,
          "averagePrice": 0,
          "reservedQuantity": 0,
          "orderedQuantity": 0,
          "isOutOfStock": true,
          "isStockAlert": true,
          "lastStockEventDate": "0001-01-01T00:10:00+00:10",
          "tarifeoPricesUpdate": null,
          "ouvrages": [],
          "chartAccountItemSalsesId": null,
          "chartAccountItemExpensesId": null,
          "chartAccountItemSalses": null,
          "chartAccountItemExpenses": null,
          "complementAnalytiqueSalses": null,
          "complementAnalytiqueExpenses": null,
          "stockIconSrc": "./assets/app/imgs/stock_out.svg",
          "stockTextColor": "#C51111",
          "id_html": "054506_Disjoncteur_T4L250_3P_FF_PR221-I_100A_V",
          "discount": {
            "type": 2,
            "value": 0
          },
          "categoryId": "Foliatech47",
          "totalFG": 1674.148,
          "totalHtNotArrondi": 4783.28,
          "totalTTCNotArrondi": 5739.936,
          "margin": -35,
          "articleId": "1753803901129-92334",
          "situation": 10
        },
        "situationProduct": 10,
        "totalHT": 4783.28,
        "totalTTC": 5739.936,
        "isValid": true,
        "comment": null,
        "totalHTArrondi": 478.328
      },
      {
        "id": null,
        "workShopId": null,
        "workShopName": null,
        "workShop": null,
        "quantity": 1,
        "initialQuantity": 0,
        "type": 1,
        "impose": false,
        "numeration": "2",
        "arrayNumerationComplete": [
          {
            "num": "2",
            "color": "#FFFFFF"
          }
        ],
        "product": {
          "id": "chlubdjubs1hu::Product::202507241849101351",
          "designation": "Article en suppression - 2573 Dynatel Détecteur de canalisation, câble et défaut de câble",
          "description": "Article en suppression - Détection de réseaux et de défauts - Identique au Dynatel 2550E, le détecteur 2573E, livré avec une fourche de localisation, offre la fonction de détection de défaut de câble (mise à la terre).",
          "reference": "1198521",
          "sellingPrice": 10314.24,
          "frais": 35,
          "prixRevient": 13924.223999999998,
          "purchasePrice": 10314.24,
          "totalHT": 10314.24,
          "taxValue": 2062.848,
          "totalTTC": 12377.088,
          "vat": 20,
          "unite": "U",
          "coefficient": 1,
          "coefficientNet": 1,
          "position": null,
          "isArchived": false,
          "productCategoryType": {
            "id": "Foliatech1",
            "label": "Fourniture",
            "description": "Fourniture",
            "type": 8
          },
          "category": {
            "id": "Foliatech47",
            "type": 1,
            "label": "Produit fini",
            "description": "Produit fini",
            "categoryType": -1,
            "isDefault": false,
            "chartAccountItem": null,
            "chartAccountItemSalses": null,
            "chartAccountItemExpenses": null,
            "subClassification": []
          },
          "productCTypeLabel": "Fourniture",
          "categoryLabel": "Produit fini",
          "labels": [],
          "productSuppliers": [
            {
              "supplierId": "chlubdjubs1hu::Supplier::202412261509549563",
              "supplier": {
                "id": "chlubdjubs1hu::Supplier::202412261509549563",
                "reference": "",
                "fullName": " ",
                "firstName": "",
                "lastName": null
              },
              "price": 0,
              "isDefault": false,
              "reference": "",
              "barCode": "0051115535482"
            },
            {
              "supplierId": "chlubdjubs1hu::Supplier::202507091650177845",
              "supplier": {
                "id": "chlubdjubs1hu::Supplier::202507091650177845",
                "reference": "FRS-00017",
                "fullName": "FRANS BONHOMME ",
                "firstName": "FRANS BONHOMME",
                "lastName": null
              },
              "price": 10314.24,
              "isDefault": true,
              "reference": "",
              "barCode": "0051115535482"
            },
            {
              "supplierId": "chlubdjubs1hu::Supplier::202507091650177846",
              "supplier": {
                "id": "chlubdjubs1hu::Supplier::202507091650177846",
                "reference": "SON01",
                "fullName": "SON01 ",
                "firstName": "SON01",
                "lastName": null
              },
              "price": 10638.36,
              "isDefault": false,
              "reference": "",
              "barCode": "0051115535482"
            }
          ],
          "defaultSupplierId": "chlubdjubs1hu::Supplier::202507091650177845",
          "infosPricingLibrary": {
            "libraryType": "Tarifeo",
            "value": {
              "IdTarifTarifeo": "699",
              "CodeArticle": "1198521",
              "Designation": "Article en suppression - 2573 Dynatel Détecteur de canalisation, câble et défaut de câble"
            }
          },
          "isDisabled": false,
          "storageLocations": [],
          "isManagedByStock": false,
          "outOfStockQuantity": 0,
          "quantityInStock": 0,
          "alertQuantity": 0,
          "averagePrice": 0,
          "reservedQuantity": 0,
          "orderedQuantity": 0,
          "isOutOfStock": true,
          "isStockAlert": true,
          "lastStockEventDate": "0001-01-01T00:10:00+00:10",
          "tarifeoPricesUpdate": null,
          "ouvrages": [],
          "chartAccountItemSalsesId": null,
          "chartAccountItemExpensesId": null,
          "chartAccountItemSalses": null,
          "chartAccountItemExpenses": null,
          "complementAnalytiqueSalses": null,
          "complementAnalytiqueExpenses": null,
          "stockIconSrc": "./assets/app/imgs/stock_out.svg",
          "stockTextColor": "#C51111",
          "id_html": "1198521_Article_en_suppression_-_2573_Dynatel_Détecteur_de_canalisation__câble_et_défaut_de_câble",
          "discount": {
            "type": 2,
            "value": 0
          },
          "categoryId": "Foliatech47",
          "totalFG": 3609.9839999999995,
          "totalHtNotArrondi": 10314.24,
          "totalTTCNotArrondi": 12377.088,
          "margin": -35,
          "articleId": "1753803901129-68748",
          "situation": 10
        },
        "situationProduct": 10,
        "totalHT": 10314.24,
        "totalTTC": 12377.088,
        "isValid": true,
        "comment": null,
        "totalHTArrondi": 1031.424
      },
      {
        "id": null,
        "workShopId": null,
        "workShopName": null,
        "workShop": null,
        "quantity": 1,
        "initialQuantity": 0,
        "type": 1,
        "impose": false,
        "numeration": "3",
        "arrayNumerationComplete": [
          {
            "num": "3",
            "color": "#FFFFFF"
          }
        ],
        "product": {
          "id": "chlubdjubs1hu::Product::202507241835063994",
          "designation": "Gale'O VDI - Cordon plat RJ45-RJ45 FTP - Longueur 0,5m - Lot de 5pcs",
          "description": "Gale'O VDI - Cordon plat RJ45-RJ45 FTP - Longueur 0,5m - Lot de 5pcs",
          "reference": "190441",
          "sellingPrice": 29.51,
          "frais": 35,
          "prixRevient": 39.8385,
          "purchasePrice": 29.51,
          "totalHT": 29.51,
          "taxValue": 5.902,
          "totalTTC": 35.412,
          "vat": 20,
          "unite": "U",
          "coefficient": 1,
          "coefficientNet": 1,
          "position": null,
          "isArchived": false,
          "productCategoryType": {
            "id": "Foliatech1",
            "label": "Fourniture",
            "description": "Fourniture",
            "type": 8
          },
          "category": {
            "id": "Foliatech47",
            "type": 1,
            "label": "Produit fini",
            "description": "Produit fini",
            "categoryType": -1,
            "isDefault": false,
            "chartAccountItem": null,
            "chartAccountItemSalses": null,
            "chartAccountItemExpenses": null,
            "subClassification": []
          },
          "productCTypeLabel": "Fourniture",
          "categoryLabel": "Produit fini",
          "labels": [],
          "productSuppliers": [
            {
              "supplierId": "chlubdjubs1hu::Supplier::202412261509549563",
              "supplier": {
                "id": "chlubdjubs1hu::Supplier::202412261509549563",
                "reference": "",
                "fullName": " ",
                "firstName": "",
                "lastName": null
              },
              "price": 0,
              "isDefault": false,
              "reference": "",
              "barCode": "3471525000436"
            },
            {
              "supplierId": "chlubdjubs1hu::Supplier::202507091650177846",
              "supplier": {
                "id": "chlubdjubs1hu::Supplier::202507091650177846",
                "reference": "SON01",
                "fullName": "SON01 ",
                "firstName": "SON01",
                "lastName": null
              },
              "price": 29.51,
              "isDefault": true,
              "reference": "",
              "barCode": "3471525000436"
            }
          ],
          "defaultSupplierId": "chlubdjubs1hu::Supplier::202507091650177846",
          "infosPricingLibrary": {
            "libraryType": "Tarifeo",
            "value": {
              "IdTarifTarifeo": "121",
              "CodeArticle": "190441",
              "Designation": "Gale'O VDI - Cordon plat RJ45-RJ45 FTP - Longueur 0,5m - Lot de 5pcs"
            }
          },
          "isDisabled": false,
          "storageLocations": [],
          "isManagedByStock": false,
          "outOfStockQuantity": 0,
          "quantityInStock": 0,
          "alertQuantity": 0,
          "averagePrice": 0,
          "reservedQuantity": 0,
          "orderedQuantity": 0,
          "isOutOfStock": true,
          "isStockAlert": true,
          "lastStockEventDate": "0001-01-01T00:10:00+00:10",
          "tarifeoPricesUpdate": null,
          "ouvrages": [],
          "chartAccountItemSalsesId": null,
          "chartAccountItemExpensesId": null,
          "chartAccountItemSalses": null,
          "chartAccountItemExpenses": null,
          "complementAnalytiqueSalses": null,
          "complementAnalytiqueExpenses": null,
          "stockIconSrc": "./assets/app/imgs/stock_out.svg",
          "stockTextColor": "#C51111",
          "id_html": "190441_Gale_O_VDI_-_Cordon_plat_RJ45-RJ45_FTP_-_Longueur_0_5m_-_Lot_de_5pcs",
          "discount": {
            "type": 2,
            "value": 0
          },
          "categoryId": "Foliatech47",
          "totalFG": 10.3285,
          "totalHtNotArrondi": 29.51,
          "totalTTCNotArrondi": 35.412,
          "margin": -35,
          "articleId": "1753803901129-74757",
          "situation": 10
        },
        "situationProduct": 10,
        "totalHT": 29.51,
        "totalTTC": 35.412,
        "isValid": true,
        "comment": null,
        "totalHTArrondi": 2.9510000000000005
      },
      {
        "id": null,
        "workShopId": null,
        "workShopName": null,
        "workShop": null,
        "quantity": 1,
        "initialQuantity": 0,
        "type": 1,
        "impose": false,
        "numeration": "4",
        "arrayNumerationComplete": [
          {
            "num": "4",
            "color": "#FFFFFF"
          }
        ],
        "product": {
          "id": "chlubdjubs1hu::Product::202507241834160425",
          "designation": "Gale'O VDI - Boitier DTI Modulaire RJ45",
          "description": "Gale'O VDI - Boitier DTI Modulaire RJ45",
          "reference": "190344",
          "sellingPrice": 29.6,
          "frais": 35,
          "prixRevient": 39.96,
          "purchasePrice": 29.6,
          "totalHT": 29.6,
          "taxValue": 5.92,
          "totalTTC": 35.52,
          "vat": 20,
          "unite": "U",
          "coefficient": 1,
          "coefficientNet": 1,
          "position": null,
          "isArchived": false,
          "productCategoryType": {
            "id": "Foliatech1",
            "label": "Fourniture",
            "description": "Fourniture",
            "type": 8
          },
          "category": {
            "id": "Foliatech47",
            "type": 1,
            "label": "Produit fini",
            "description": "Produit fini",
            "categoryType": -1,
            "isDefault": false,
            "chartAccountItem": null,
            "chartAccountItemSalses": null,
            "chartAccountItemExpenses": null,
            "subClassification": []
          },
          "productCTypeLabel": "Fourniture",
          "categoryLabel": "Produit fini",
          "labels": [],
          "productSuppliers": [
            {
              "supplierId": "chlubdjubs1hu::Supplier::202412261509549563",
              "supplier": {
                "id": "chlubdjubs1hu::Supplier::202412261509549563",
                "reference": "",
                "fullName": " ",
                "firstName": "",
                "lastName": null
              },
              "price": 0,
              "isDefault": false,
              "reference": "",
              "barCode": "3471521903441"
            },
            {
              "supplierId": "chlubdjubs1hu::Supplier::202507091650177846",
              "supplier": {
                "id": "chlubdjubs1hu::Supplier::202507091650177846",
                "reference": "SON01",
                "fullName": "SON01 ",
                "firstName": "SON01",
                "lastName": null
              },
              "price": 29.6,
              "isDefault": true,
              "reference": "",
              "barCode": "3471521903441"
            }
          ],
          "defaultSupplierId": "chlubdjubs1hu::Supplier::202507091650177846",
          "infosPricingLibrary": {
            "libraryType": "Tarifeo",
            "value": {
              "IdTarifTarifeo": "121",
              "CodeArticle": "190344",
              "Designation": "Gale'O VDI - Boitier DTI Modulaire RJ45"
            }
          },
          "isDisabled": false,
          "storageLocations": [],
          "isManagedByStock": false,
          "outOfStockQuantity": 0,
          "quantityInStock": 0,
          "alertQuantity": 0,
          "averagePrice": 0,
          "reservedQuantity": 0,
          "orderedQuantity": 0,
          "isOutOfStock": true,
          "isStockAlert": true,
          "lastStockEventDate": "0001-01-01T00:10:00+00:10",
          "tarifeoPricesUpdate": null,
          "ouvrages": [],
          "chartAccountItemSalsesId": null,
          "chartAccountItemExpensesId": null,
          "chartAccountItemSalses": null,
          "chartAccountItemExpenses": null,
          "complementAnalytiqueSalses": null,
          "complementAnalytiqueExpenses": null,
          "stockIconSrc": "./assets/app/imgs/stock_out.svg",
          "stockTextColor": "#C51111",
          "id_html": "190344_Gale_O_VDI_-_Boitier_DTI_Modulaire_RJ45",
          "discount": {
            "type": 2,
            "value": 0
          },
          "categoryId": "Foliatech47",
          "totalFG": 10.36,
          "totalHtNotArrondi": 29.6,
          "totalTTCNotArrondi": 35.52,
          "margin": -35,
          "articleId": "1753803901129-96291",
          "situation": 10
        },
        "situationProduct": 10,
        "totalHT": 29.6,
        "totalTTC": 35.52,
        "isValid": true,
        "comment": null,
        "totalHTArrondi": 2.9600000000000004
      }
    ],
    "productsPricingDetails": {
      "totalHours": 0,
      "salesPrice": 0
    },
    "acompteFinanciere": {
      "value": 0,
      "amount": 0
    },
    "showNumbering": true,
    "isNumerationAuto": true,
    "typeNumeration": 0,
    "totalHT": 1515.663,
    "totalTax": 303.13,
    "generalTotalHT": 1515.66,
    "totalPUC": 0,
    "ajustementCalcul": []
  },
  "quotesIds": ["chlubdjubs1hu::Quote::202507291745031413"],
  "responsables": [],
  "addLabelTva": "",
  "contacts": [],
  "textAcompte": {
    "designation": "Acompte de réalisation de 10.00% sur le devis DEVIS n°111330",
    "description": "Rappel total TTC Devis : 18187.96€\nTotal avancement de facturation : 10 % "
  },
  "typeFinanciere": 0
}
```
console.log the body when creating an invoice.
w
