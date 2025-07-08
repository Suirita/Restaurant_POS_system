run this api:"https://preprod-axiobat.foliatech.app/omicron/api/Product/Create"
 with this body:"
 {
  "reference": "",
  "description": "",
  "designation": "",
  "vat": 0,
  "unite": "U",
  "categoryId": "",
  "labels": [],
  "purchasePrice": 0,
  "coefficient": 0,
  "sellingPrice": 0,
  "productCategoryType": {
      "id": "Foliatech88",
      "label": "Repas",
      "description": "Repas",
      "type": 13,
      "id_html": "Repas"
    },
  "productCategoryTypeId": "Foliatech88",
  "tauxMarge": 0,
  "disableSellingPrice": false,
  "totalHT": 20,
  "totalTTC": "20.00",
  "productSuppliers": []
}"
and this headers:'
"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ1c2VyQGVtYWlsLmNvbSIsInVzZXJOYW1lIjoidXNlcjAxIiwidXNlcklkIjoiYjAxOWQwYmItY2Q5Ny00YTFlLTk3NzAtNDExYTJhMTMzMDAyIiwiZnVsbE5hbWUiOiJQcmVub21VU0VSIHVzZXIwMSIsInNvY2lldGVJZCI6IkZvbGlhdGVjaCIsImRldmlzZSI6IuKCrCIsImlzUGVyc29ubmVsQ2hhbnRpZXIiOiJGYWxzZSIsInBlcm1pc3Npb25Tb2NpZXRlIjoiWzQyLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzLDE1LDE2LDE3LDE4LDE5LDIwLDIyLDIzLDI0LDI1LDI2LDI3LDI4LDI5LDMxLDMzLDMyLDM4LDM5LDQzLDQ0LDM0LDM1LDQwLDQxLDM2LDQ1LDQ2LDYwLDYxLDYyLDQ3LDMwMCw0OCw2NCw2Myw1MF0iLCJtZXNzYWdlcmllR2xvYmFsIjoie1wiYWNjZXNzVG9rZW5cIjpudWxsLFwidG9rZW5FeHBpcmF0aW9uRGF0ZVwiOm51bGwsXCJlbWFpbFwiOlwiYnJhaGltLmRlcnJvdWljaEBnbWFpbC5jb21cIn0iLCJtZXNzYWdlcmllVXNlciI6IntcImFjY2Vzc1Rva2VuXCI6bnVsbCxcInRva2VuRXhwaXJhdGlvbkRhdGVcIjpudWxsLFwiZW1haWxcIjpcInRlc3Qtc29jaWV0ZUBmb2xpYXRlY2guYXBwXCJ9IiwiZGlzcGFseVByaW1lIjoiRmFsc2UiLCJhYm9ubmVtZW50IjoiIiwicm9sZU5hbWUiOiJEaXJlY3Rpb24iLCJyb2xlSWQiOiJiYjk4MGY3OS1kZjZiLTQ2OGMtYjA1YS04NDIyYjFmYzQwZTAiLCJyb2xlVHlwZSI6IjEiLCJwZXJtaXNzaW9ucyI6IlszMDEsMzA0LDU4MSw1NjEsNTYyLDU2Myw1NjQsNiwxLDIsMyw0LDUsMjUwNiwzMDAwLDIxLDIyLDIzLDI0LDMwMDEsMTAwMCwxMDAxLDEwMDIsMTAwMywxMDA0LDEwMDUsMTAwNiwxMDA3LDEwMjAsMTAyMSwyNDAsMjQxLDI0MiwyNDMsMjQ0LDI4MiwyNjEsMjYyLDI2MywyNjQsMjQwMCwyNDAxLDI0MDIsMjQwMyw2NjAsNjYxLDMwMDIsNjYzLDMwMzAsMzAzMSw0NDAsNDQxLDQ0Miw0NDMsNDQ0LDQwNjAsNDA2NCw0ODcsNDQ1LDQ1MSw0NTIsNDUzLDQ1NiwzMDAzLDY5NCw2OTUsNjk2LDY5NywzMDE3LDYwOTQsNjA5NSw2MDk2LDYwOTcsNjA5OCw2MDk5LDYwOTMsNDA5MSw0MDkyLDQwOTMsNDA5NCwyNTA3LDQ0NiwzMDIyLDQ1NCw0NTUsNDUwLDQwMCw0MDEsNDAyLDQwMyw0MDQsNzAxLDcwNSw3MDQsNzAzLDMwMDQsMjUwNCw0MDYsNDA4LDQwOSw3NzEsMzAyMCw3MDIsNDQ4LDQ2MCw0MjEsNDIyLDQyMyw0MjQsNDI4LDQzMCw0MDQ0LDQwNDUsMzAwNSwyNTAzLDQyNSw0MDQ2LDQwNDcsNzczLDMwMjEsNDQ5LDQyNyw0NjEsNDYyLDQ2Myw0NjQsNDgxLDQ4Miw0ODMsNDg0LDQ4NSw1MDEsODAsODEsODIsODMsODQsODcsOTAsODksMzAwNiw4NSwyNTAwLDg4LDY3MCw2MSw2Miw2Myw2NCwzMDA3LDY5LDI1MDEsMjAyMSwyMDIyLDIwMjMsMjAyNCwyMDI1LDU1MSw1NTksNzAsNzEsNTUwLDMwMDgsNTU1LDU1Nyw1NTgsMzAwOSwxMDEsMTAyLDEwMywxMDQsMzAxMCwxMDUsMjUwMiwxMDYsMTA3LDE0MCwxNDEsMTQyLDE0MywxNDQsMzAxMSwyNTA1LDE0NSwxNDYsMjAxLDIwMiwyMDMsMjA0LDMwNTAsMzAxMiwyMDQxLDIwNDIsMjA0MywyMDQ0LDIwNDUsMjA1LDIwNiw2NzEsNjcyLDY3Myw2NzQsODIwLDgyMSw4MjIsODIzLDgwMCw4MDEsODAyLDgwMywyNTA4LDkwMCw5MDEsOTAyLDkwMywzMDE4LDIyMSwyMjIsMjIzLDIyNCwzMDEzLDU0MSw1NDIsNTQzLDU0NCw0MCw0MSw0Miw0Myw0NCwzMDE0LDQ2LDQ3LDQ1LDQxMTAsNDExMSw0MTEyLDQxMTMsNDEyMCw0MTIxLDQxMjIsNDEyMyw0MTMwLDQxMzEsNDEzMiw0MTMzLDQxNDAsNDE0MSw0MTQyLDQxNDMsNDE1MCw0MTUxLDQxNTIsNDE1Myw2MjEsNjg3MSw2ODcwLDY4NzIsNjg3Myw2ODUxLDY4NTAsNjg1Miw2ODUzLDY4NTUsNjg4MCw2ODgxLDY4ODIsNjg4Myw2ODg1LDY4ODYsNjg4Nyw2ODg4LDY4OTAsNjg5MSwzMDE2LDY4OTIsNjg3NSw1NjUsMzAxNSw2ODc2LDM0MCwzNDEsMzQyLDM0MywyODEsNjAwLDYwMSw3ODAsMzgxLDM4MiwyMDA4LDIwMDksMjAxMCwyMDExLDIwMTIsMzAxOSwyMDAwLDIwMDEsMjAwMiwyMDAzLDIwMTMsMjAwNCwyMDA1LDIwMDYsMjAwNywyMDE0LDMwNDAsMzA0MSwzMDQyLDMwNDMsMzA0NCwzMDQ1LDMwNDYsMzA0N10iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2F1dGhlbnRpY2F0aW9ubWV0aG9kIjoiQmVhcmVyIiwic3ViIjoidXNlcjAxIiwianRpIjoiNzNkMmVkY2EtYWE2NC00MmJmLTljZTEtYmJmZWFiY2E2NDYwIiwiaWF0IjoxNzUxNjM4MTMyLCJuYmYiOjE3NTE2MzgxMzIsImV4cCI6MTc1MjA3MDEzMiwiaXNzIjoiSW5vdmFTcXVhZC5jb20iLCJhdWQiOiJJbm92YVNxdWFkLmNvbSJ9.kUY8AD5CLUxRIsvEKlV6hZKHeFJrGEE4MTUulffWHrY"
'

for every one of this meals, designation is the name of the meal, categoryId is the id of the category, sellingPrice is random, and for the rest of the fiels, leave them as they are.

---

## Dessert: id: 25c13896-7a24-47a1-ab96-a1e19b816d99

1. **Crème Brûlée** - https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc
2. **Tarte Tatin** - https://images.unsplash.com/photo-1571115764595-644a1f56a55c
3. **Macarons** - https://images.unsplash.com/photo-1569718212165-3a8278d5f624
4. **Éclair au Chocolat** - https://images.unsplash.com/photo-1578985545062-69928b1d9587
5. **Mousse au Chocolat** - https://images.unsplash.com/photo-1541781774459-bb2af2f05b55
6. **Profiteroles** - https://images.unsplash.com/photo-1586985289906-406988974504
7. **Mille-feuille** - https://images.unsplash.com/photo-1563805042-7684c019e1cb
8. **Tarte au Citron** - https://images.unsplash.com/photo-1565958011703-44f9829ba187
9. **Soufflé au Grand Marnier** - https://images.unsplash.com/photo-1551024506-0bccd828d307
10. **Clafoutis aux Cerises** - https://images.unsplash.com/photo-1558618666-fcd25c85cd64
11. **Crème Caramel** - https://images.unsplash.com/photo-1584717524001-74d47c5e84a4
12. **Tarte aux Fraises** - https://images.unsplash.com/photo-1594736797933-d0b22d3180cb
13. **Pain Perdu** - https://images.unsplash.com/photo-1484723091739-30a097e8f929
14. **Île Flottante** - https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae
15. **Madeleines** - https://images.unsplash.com/photo-1509440159596-0249088772ff
16. **Canelés** - https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b
17. **Charlotte aux Fruits** - https://images.unsplash.com/photo-1571877227200-a0d98ea607e9
18. **Tarte Tropézienne** - https://images.unsplash.com/photo-1606313564200-e75d5e30476c
19. **Baba au Rhum** - https://images.unsplash.com/photo-1551218808-94e220e084d2
20. **Choux à la Crème** - https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae
21. **Palmiers** - https://images.unsplash.com/photo-1599599810769-bcde5a160d32
22. **Religieuse** - https://images.unsplash.com/photo-1578662996442-48f60103fc96
23. **Tartelettes aux Fruits** - https://images.unsplash.com/photo-1587736804099-24b711cc1ba3
24. **Kouign-amann** - https://images.unsplash.com/photo-1581191722513-5ce19be6d0b9

## Dessert: id: 25c13896-7a24-47a1-ab96-a1e19b816d99

1. **Bouillabaisse** - https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b
2. **Plateau de Fruits de Mer** - https://images.unsplash.com/photo-1559847844-5315695dadae
3. **Coquilles Saint-Jacques** - https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62
4. **Moules Marinières** - https://images.unsplash.com/photo-1599487488170-d11ec9c172f0
5. **Huîtres de Belon** - https://images.unsplash.com/photo-1570197788417-0e82375c9371
6. **Sole Meunière** - https://images.unsplash.com/photo-1544943151-6e4ed999de46
7. **Langoustines Grillées** - https://images.unsplash.com/photo-1583623025817-d180a2221d0a
8. **Crevettes à l'Ail** - https://images.unsplash.com/photo-1565680018434-b513d5e5fd47
9. **Homard à l'Américaine** - https://images.unsplash.com/photo-1571091718767-18b5b1457add
10. **Saumon Grillé** - https://images.unsplash.com/photo-1467003909585-2f8a72700288
11. **Brandade de Morue** - https://images.unsplash.com/photo-1540420773420-3366772f4999
12. **Turbot aux Petits Légumes** - https://images.unsplash.com/photo-1559847844-112b36e093aa
13. **Crabe Farci** - https://images.unsplash.com/photo-1580476262798-bddd9f4b7369
14. **Lotte à l'Armoricaine** - https://images.unsplash.com/photo-1534766438357-2b733082b608
15. **Dorade Royale** - https://images.unsplash.com/photo-1555939594-58d7cb561ad1
16. **Bisque de Homard** - https://images.unsplash.com/photo-1547592166-23ac45744acd
17. **Saumon Fumé** - https://images.unsplash.com/photo-1580476262798-bddd9f4b7369
18. **Rouget Grillé** - https://images.unsplash.com/photo-1535140728325-781d5ee86683
19. **Coquilles de Poisson** - https://images.unsplash.com/photo-1534766438357-2b733082b608
20. **Plateau d'Huîtres** - https://images.unsplash.com/photo-1606756790138-261d2b21cd75
21. **Raie au Beurre Noir** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
22. **Marmite du Pêcheur** - https://images.unsplash.com/photo-1565299585323-38174c5a4f94
23. **Cabillaud à la Provençale** - https://images.unsplash.com/photo-1580476262798-bddd9f4b7369
24. **Fricassée de Fruits de Mer** - https://images.unsplash.com/photo-1606756790138-261d2b21cd75

## Bœuf: id: 3f4e2033-57ef-4591-93f8-ec9fb3940280

1. **Bœuf Bourguignon** - https://images.unsplash.com/photo-1574484284002-952d92456975
2. **Entrecôte Grillée** - https://images.unsplash.com/photo-1558030006-450675393462
3. **Pot-au-feu** - https://images.unsplash.com/photo-1546833999-b9f581a1996d
4. **Steak Tartare** - https://images.unsplash.com/photo-1546833999-b9f581a1996d
5. **Côte de Bœuf** - https://images.unsplash.com/photo-1544025162-d76694265947
6. **Carbonnade Flamande** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
7. **Bœuf aux Carottes** - https://images.unsplash.com/photo-1574484284002-952d92456975
8. **Filet de Bœuf Wellington** - https://images.unsplash.com/photo-1546833999-b9f581a1996d
9. **Daube de Bœuf** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
10. **Châteaubriand** - https://images.unsplash.com/photo-1558030006-450675393462
11. **Bœuf Stroganoff** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
12. **Bavette à l'Échalote** - https://images.unsplash.com/photo-1546833999-b9f581a1996d
13. **Joue de Bœuf Braisée** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
14. **Rôti de Bœuf** - https://images.unsplash.com/photo-1544025162-d76694265947
15. **Bœuf à la Mode** - https://images.unsplash.com/photo-1574484284002-952d92456975
16. **Tournedos Rossini** - https://images.unsplash.com/photo-1558030006-450675393462
17. **Émincé de Bœuf** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
18. **Bœuf Sauté aux Oignons** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
19. **Pavé de Bœuf** - https://images.unsplash.com/photo-1544025162-d76694265947
20. **Bœuf Mironton** - https://images.unsplash.com/photo-1574484284002-952d92456975
21. **Carpaccio de Bœuf** - https://images.unsplash.com/photo-1546833999-b9f581a1996d
22. **Bœuf en Croûte** - https://images.unsplash.com/photo-1558030006-450675393462
23. **Estouffade de Bœuf** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
24. **Bœuf Braisé aux Légumes** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8

## Poulet: id: 4b4403a5-d8d1-4901-8e94-542704e0a66b

1. **Coq au Vin** - https://images.unsplash.com/photo-1598103442097-8b74394b95c6
2. **Poulet Rôti** - https://images.unsplash.com/photo-1548940740-204726a19be3
3. **Poulet à la Crème** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
4. **Poulet Basquaise** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
5. **Blanquette de Volaille** - https://images.unsplash.com/photo-1574484284002-952d92456975
6. **Poulet aux Herbes** - https://images.unsplash.com/photo-1548940740-204726a19be3
7. **Suprême de Volaille** - https://images.unsplash.com/photo-1598103442097-8b74394b95c6
8. **Poulet Vallée d'Auge** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
9. **Poulet Chasseur** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
10. **Poulet aux Quarante Gousses d'Ail** - https://images.unsplash.com/photo-1574484284002-952d92456975
11. **Poulet à l'Estragon** - https://images.unsplash.com/photo-1548940740-204726a19be3
12. **Poulet Marengo** - https://images.unsplash.com/photo-1598103442097-8b74394b95c6
13. **Fricassée de Poulet** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
14. **Poulet aux Champignons** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
15. **Poulet Fermier** - https://images.unsplash.com/photo-1574484284002-952d92456975
16. **Poulet à la Moutarde** - https://images.unsplash.com/photo-1548940740-204726a19be3
17. **Poulet Tandoori** - https://images.unsplash.com/photo-1598103442097-8b74394b95c6
18. **Poulet Citron** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
19. **Poulet Yassa** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
20. **Poulet au Curry** - https://images.unsplash.com/photo-1574484284002-952d92456975
21. **Poulet Grillé** - https://images.unsplash.com/photo-1548940740-204726a19be3
22. **Poulet Provençal** - https://images.unsplash.com/photo-1598103442097-8b74394b95c6
23. **Poulet Riesling** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
24. **Poulet Sauté aux Légumes** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143

## Agneau: id: 9f8e2d1a-4c5d-4d49-8503-a9e5b5e399e0

1. **Gigot d'Agneau** - https://images.unsplash.com/photo-1544025162-d76694265947
2. **Carré d'Agneau** - https://images.unsplash.com/photo-1558030006-450675393462
3. **Côtelettes d'Agneau** - https://images.unsplash.com/photo-1546833999-b9f581a1996d
4. **Navarin d'Agneau** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
5. **Épaule d'Agneau** - https://images.unsplash.com/photo-1574484284002-952d92456975
6. **Agneau aux Flageolets** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
7. **Selle d'Agneau** - https://images.unsplash.com/photo-1544025162-d76694265947
8. **Agneau Confit** - https://images.unsplash.com/photo-1558030006-450675393462
9. **Méchoui d'Agneau** - https://images.unsplash.com/photo-1546833999-b9f581a1996d
10. **Agneau à la Provençale** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
11. **Souris d'Agneau** - https://images.unsplash.com/photo-1574484284002-952d92456975
12. **Agneau aux Herbes** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
13. **Tajine d'Agneau** - https://images.unsplash.com/photo-1544025162-d76694265947
14. **Agneau Braisé** - https://images.unsplash.com/photo-1558030006-450675393462
15. **Pieds d'Agneau** - https://images.unsplash.com/photo-1546833999-b9f581a1996d
16. **Agneau Rôti** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
17. **Curry d'Agneau** - https://images.unsplash.com/photo-1574484284002-952d92456975
18. **Agneau Grillé** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
19. **Agneau Laqué** - https://images.unsplash.com/photo-1544025162-d76694265947
20. **Râgout d'Agneau** - https://images.unsplash.com/photo-1558030006-450675393462
21. **Agneau Farci** - https://images.unsplash.com/photo-1546833999-b9f581a1996d
22. **Agneau aux Artichauts** - https://images.unsplash.com/photo-1603360946369-dc9bb6258143
23. **Émincé d'Agneau** - https://images.unsplash.com/photo-1574484284002-952d92456975
24. **Agneau Mariné** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8

## Pâtes: id: b69c9e4e-9a5a-40e4-99b8-8f7aad557b57

1. **Spaghetti Carbonara** - https://images.unsplash.com/photo-1551892374-ecf8754cf8b0
2. **Fettuccine Alfredo** - https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5
3. **Penne Arrabiata** - https://images.unsplash.com/photo-1556909114-f6e7ad7d3136
4. **Lasagnes à la Bolognaise** - https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b
5. **Tagliatelles aux Champignons** - https://images.unsplash.com/photo-1563379091339-03246963d2a6
6. **Raviolis aux Épinards** - https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d
7. **Linguine aux Fruits de Mer** - https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae
8. **Pappardelle au Sanglier** - https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb
9. **Gnocchis à la Sauge** - https://images.unsplash.com/photo-1587736804099-24b711cc1ba3
10. **Cannellonis Ricotta** - https://images.unsplash.com/photo-1571877227200-a0d98ea607e9
11. **Tortellinis à la Crème** - https://images.unsplash.com/photo-1606313564200-e75d5e30476c
12. **Farfalle au Saumon** - https://images.unsplash.com/photo-1599599810769-bcde5a160d32
13. **Rigatoni à l'Amatriciana** - https://images.unsplash.com/photo-1578662996442-48f60103fc96
14. **Orecchiette aux Brocolis** - https://images.unsplash.com/photo-1581191722513-5ce19be6d0b9
15. **Macaronis au Fromage** - https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b
16. **Conchiglie Farcies** - https://images.unsplash.com/photo-1584717524001-74d47c5e84a4
17. **Fusilli au Pesto** - https://images.unsplash.com/photo-1594736797933-d0b22d3180cb
18. **Spaghettis aux Palourdes** - https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae
19. **Penne aux Légumes** - https://images.unsplash.com/photo-1551218808-94e220e084d2
20. **Agnolotti du Plin** - https://images.unsplash.com/photo-1606313564200-e75d5e30476c
21. **Bucatini all'Amatriciana** - https://images.unsplash.com/photo-1599599810769-bcde5a160d32
22. **Capellini au Basilic** - https://images.unsplash.com/photo-1578662996442-48f60103fc96
23. **Pâtes aux Truffes** - https://images.unsplash.com/photo-1581191722513-5ce19be6d0b9
24. **Crozets de Savoie** - https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b

## Accompagnement: id: c791d31f-319d-4264-86e9-f406e6933e7e

1. **Gratin Dauphinois** - https://images.unsplash.com/photo-1518013431117-eb1465fa5752
2. **Ratatouille** - https://images.unsplash.com/photo-1512621776951-a57141f2eefd
3. **Pommes Sarladaises** - https://images.unsplash.com/photo-1553621042-f6e147245754
4. **Haricots Verts** - https://images.unsplash.com/photo-1506084868230-bb9d95c24759
5. **Purée de Pommes de Terre** - https://images.unsplash.com/photo-1553621042-f6e147245754
6. **Carottes Vichy** - https://images.unsplash.com/photo-1506084868230-bb9d95c24759
7. **Épinards à la Crème** - https://images.unsplash.com/photo-1512621776951-a57141f2eefd
8. **Petits Pois à la Française** - https://images.unsplash.com/photo-1518013431117-eb1465fa5752
9. **Courgettes Sautées** - https://images.unsplash.com/photo-1553621042-f6e147245754
10. **Artichauts à la Barigoule** - https://images.unsplash.com/photo-1506084868230-bb9d95c24759
11. **Champignons de Paris** - https://images.unsplash.com/photo-1512621776951-a57141f2eefd
12. **Endives au Jambon** - https://images.unsplash.com/photo-1518013431117-eb1465fa5752
13. **Fenouil Braisé** - https://images.unsplash.com/photo-1553621042-f6e147245754
14. **Chou-fleur Gratiné** - https://images.unsplash.com/photo-1506084868230-bb9d95c24759
15. **Poireaux Vinaigrette** - https://images.unsplash.com/photo-1512621776951-a57141f2eefd
16. **Aubergines Provençales** - https://images.unsplash.com/photo-1518013431117-eb1465fa5752
17. **Brocolis Vapeur** - https://images.unsplash.com/photo-1553621042-f6e147245754
18. **Navets Glacés** - https://images.unsplash.com/photo-1506084868230-bb9d95c24759
19. **Betteraves Rouges** - https://images.unsplash.com/photo-1512621776951-a57141f2eefd
20. **Céleri Rémoulade** - https://images.unsplash.com/photo-1518013431117-eb1465fa5752
21. **Pommes Boulangère** - https://images.unsplash.com/photo-1553621042-f6e147245754
22. **Légumes Confits** - https://images.unsplash.com/photo-1506084868230-bb9d95c24759
23. **Jardinière de Légumes** - https://images.unsplash.com/photo-1512621776951-a57141f2eefd
24. **Tian de Légumes** - https://images.unsplash.com/photo-1518013431117-eb1465fa5752

## Végétalien: id: f1c5257f-9a14-4d09-9da7-ad4532b4d06b

1. **Ratatouille Niçoise** - https://images.unsplash.com/photo-1512621776951-a57141f2eefd
2. **Salade de Quinoa** - https://images.unsplash.com/photo-1506084868230-bb9d95c24759
3. **Curry de Légumes** - https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b
4. **Taboulé de Crudités** - https://images.unsplash.com/photo-1553621042-f6e147245754
5. **Houmous aux Légumes** - https://images.unsplash.com/photo-1518013431117-eb1465fa5752
6. **Bols de Buddha** - https://images.unsplash.com/photo-1547592166-23ac45744acd
7. **Soupe de Lentilles** - https://images.unsplash.com/photo-1565299585323-38174c5a4f94
8. **Galettes de Légumes** - https://images.unsplash.com/photo-1540420773420-3366772f4999
9. **Chili sin Carne** - https://images.unsplash.com/photo-1559847844-112b36e093aa
10. **Couscous aux Légumes** - https://images.unsplash.com/photo-1580476262798-bddd9f4b7369
11. **Risotto aux Champignons** - https://images.unsplash.com/photo-1534766438357-2b733082b608
12. **Légumes Grillés** - https://images.unsplash.com/photo-1555939594-58d7cb561ad1
13. **Salade de Pois Chiches** - https://images.unsplash.com/photo-1535140728325-781d5ee86683
14. **Tartines d'Avocat** - https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8
15. **Wok de Légumes** - https://images.unsplash.com/photo-1606756790138-261d2b21cd75
16. **Smoothie Bowl** - https://images.unsplash.com/photo-1583623025817-d180a2221d0a
17. **Falafel Maison** - https://images.unsplash.com/photo-1565680018434-b513d5e5fd47
18. **Soupe de Butternut** - https://images.unsplash.com/photo-1571091718767-18b5b1457add
19. **Salade de Quinoa Rouge** - https://images.unsplash.com/photo-1467003909585-2f8a72700288
20. **Burger Végétal** - https://images.unsplash.com/photo-1570197788417-0e82375c9371
21. **Tarte aux Légumes** - https://images.unsplash.com/photo-1583623025817-d180a2221d0a
22. **Gazpacho de Légumes** - https://images.unsplash.com/photo-1565680018434-b513d5e5fd47
23. **Poêlée de Légumes** - https://images.unsplash.com/photo-1571091718767-18b5b1457add
24. **Salade Composée** - https://images.unsplash.com/photo-1467003909585-2f8a72700288
