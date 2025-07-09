import { Component, output, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt, UserAccount } from '../../types/pos.types';
import { ReceiptService } from '../../receipt.service';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-all-receipts-modal',
  templateUrl: './all-receipts-modal.html',
  imports: [CommonModule, LucideAngularModule],
})
export class AllReceiptsModalComponent {
  readonly XIcon = X;

  private receiptService = inject(ReceiptService);
  receipts = signal<Receipt[]>([]);
  userId = input.required<string>();
  token = input.required<string>();

  close = output<void>();
  pay = output<string>();
  receiptSelected = output<Receipt>();

  ngOnInit() {
    this.loadReceipts();
  }

  loadReceipts() {
    this.receiptService
      .getReceipts(this.userId(), this.token())
      .subscribe((receipts) => {
        this.receipts.set(receipts);
      });
  }

  onClose() {
    this.close.emit();
  }

  onPay(orderNumber: string) {
    this.pay.emit(orderNumber);
    this.loadReceipts();
  }

  onPayClick(orderNumber: string) {
    this.onPay(orderNumber);
  }

  onReceiptClick(receipt: Receipt) {
    this.receiptSelected.emit(receipt);
  }
}
