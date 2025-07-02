import { Injectable } from '@angular/core';
import { Receipt } from './types/pos.types';

@Injectable({
  providedIn: 'root',
})
export class ReceiptService {
  private readonly STORAGE_KEY = 'receipts';

  constructor() {}

  saveReceipt(receipt: Receipt): void {
    const allReceipts = this.getAllReceipts();
    allReceipts.push(receipt);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allReceipts));
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
      receipt => receipt.orderNumber !== orderNumber
    );
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allReceipts));
  }

  private getAllReceipts(): Receipt[] {
    const receiptsJson = localStorage.getItem(this.STORAGE_KEY);
    return receiptsJson ? JSON.parse(receiptsJson) : [];
  }
}
