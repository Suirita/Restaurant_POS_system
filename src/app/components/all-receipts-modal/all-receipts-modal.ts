import { Component, output, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt, UserAccount } from '../../types/pos.types';
import { ReceiptService } from '../../receipt.service';
import { LucideAngularModule, X, LoaderCircle } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-all-receipts-modal',
  templateUrl: './all-receipts-modal.html',
  imports: [CommonModule, LucideAngularModule],
})
export class AllReceiptsModalComponent {
  readonly XIcon = X;
  readonly Loader = LoaderCircle;

  private receiptService = inject(ReceiptService);
  receipts = signal<Receipt[]>([]);
  isLoading = signal<boolean>(false);
  userId = input.required<string>();
  token = input.required<string>();

  close = output<void>();
  pay = output<string>();
  receiptSelected = output<Receipt>();

  ngOnInit() {
    this.loadReceipts();
  }

  loadReceipts() {
    this.isLoading.set(true);
    this.receiptService
      .getAllReceipts(this.token(), this.userId(), ['in_progress'])
      .subscribe((receipts: Receipt[]) => {
        this.receipts.set(receipts);
        this.isLoading.set(false);
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
    console.log('onReceiptClick called in component:', receipt);
    this.receiptSelected.emit(receipt);
  }
}
