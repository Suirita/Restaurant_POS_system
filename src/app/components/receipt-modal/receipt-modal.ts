import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt } from '../../types/pos.types';

@Component({
  standalone: true,
  selector: 'app-receipt-modal',
  templateUrl: './receipt-modal.html',
  imports: [CommonModule],
})
export class ReceiptModalComponent {
  receipt = input.required<Receipt | null>();
  isVisible = input.required<boolean>();

  closeReceipt = output<void>();
  printReceipt = output<void>();

  onClose() {
    this.closeReceipt.emit();
  }

  onPrint() {
    this.printReceipt.emit();
  }
}
