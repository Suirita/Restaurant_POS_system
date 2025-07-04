import { Component, output, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt } from '../../types/pos.types';
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
  receipts: Receipt[] = [];
  userId = input.required<string>();

  close = output<void>();
  pay = output<string>();
  receiptSelected = output<Receipt>();

  ngOnInit() {
    this.receipts = this.receiptService.getReceipts(this.userId());
  }

  onClose() {
    this.close.emit();
  }

  onPay(orderNumber: string) {
    this.pay.emit(orderNumber);
    this.receipts = this.receiptService.getReceipts(this.userId());
  }

  onPayClick(orderNumber: string) {
    this.onPay(orderNumber);
  }

  onReceiptClick(receipt: Receipt) {
    this.receiptSelected.emit(receipt);
  }
}
