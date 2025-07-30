import { Component, input, output, signal, computed } from '@angular/core';
import { LucideAngularModule, Check } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-calculator',
  templateUrl: './calculator.html',
  imports: [CommonModule, LucideAngularModule],
})
export class CalculatorComponent {
  readonly Check = Check;

  displayValue = input.required<string>();
  canConfirm = input.required<boolean>();
  isQuantityMode = input.required<boolean>();
  disabled = input<boolean>(false);
  isTransferMode = input<boolean>(false);

  numberAdded = output<string>();
  cleared = output<void>();
  confirmed = output<void>();
  decimalAdded = output<void>();
  transfer = output<string>();

  destinationTable = signal<string>('');

  onAddNumber(num: string) {
    if (this.isTransferMode()) {
      if (this.destinationTable().length < 3) {
        this.destinationTable.set(this.destinationTable() + num);
      }
    } else {
      this.numberAdded.emit(num);
    }
  }

  onAddDecimal() {
    this.decimalAdded.emit();
  }

  onClear() {
    if (this.isTransferMode()) {
      this.destinationTable.set('');
    } else {
      this.cleared.emit();
    }
  }

  onConfirm() {
    if (this.isTransferMode()) {
      if (this.destinationTable()) {
        this.transfer.emit(this.destinationTable());
      }
    } else {
      this.confirmed.emit();
    }
  }
}
