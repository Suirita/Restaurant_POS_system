import { Component, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, X } from 'lucide-angular';
import { CalculatorComponent } from '../calculator/calculator';

@Component({
  standalone: true,
  selector: 'app-transfer-modal',
  templateUrl: './transfer-modal.html',
  imports: [CommonModule, LucideAngularModule, CalculatorComponent],
})
export class TransferModalComponent {
  readonly XIcon = X;

  close = output<void>();
  transfer = output<string>();

  destinationTable = signal<string>('');
  transferErrorMessage = signal<string | null>(null);

  calculatorDisplayValue = computed(() => this.destinationTable() || '0');
  calculatorCanConfirm = computed(() => this.destinationTable().length > 0);
  calculatorIsQuantityMode = computed(() => false);
  canConfirmTransfer = computed(() => this.destinationTable().length > 0);

  closeModal() {
    this.close.emit();
  }

  confirmTransfer() {
    if (this.destinationTable()) {
      this.transfer.emit(this.destinationTable());
    }
  }

  onCalculatorNumberAdded(num: string) {
    if (this.destinationTable().length < 3) {
      this.destinationTable.set(this.destinationTable() + num);
    }
  }

  onCalculatorDecimalAdded() {
    // Not applicable for table numbers
  }

  onCalculatorCleared() {
    this.destinationTable.set('');
  }

  onCalculatorConfirmed() {
    this.confirmTransfer();
  }
}
