import { Component, output, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt } from '../../types/pos.types';
import { ReceiptService } from '../../receipt.service';

@Component({
  standalone: true,
  selector: 'app-all-receipts-modal',
  templateUrl: './all-receipts-modal.html',
  imports: [CommonModule],
})
export class AllReceiptsModalComponent {
  private receiptService = inject(ReceiptService);
  receipts: Receipt[] = [];
  userId = input.required<string>();

  close = output<void>();
  pay = output<string>();

  ngOnInit() {
    this.receipts = this.receiptService.getReceipts(this.userId());
  }

  onClose() {
    this.close.emit();
  }

  onPay(tableName: string) {
    this.pay.emit(tableName);
  }
}
