import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private selectedReceiptSource = new BehaviorSubject<any>(null);
  selectedReceipt$ = this.selectedReceiptSource.asObservable();

  constructor() {}

  selectReceipt(receipt: any) {
    this.selectedReceiptSource.next(receipt);
  }
}