import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-calculator',
  templateUrl: './calculator.html',
  imports: [CommonModule],
})
export class CalculatorComponent {
  displayValue = input.required<string>();
  canConfirm = input.required<boolean>();
  isQuantityMode = input.required<boolean>();

  numberAdded = output<string>();
  cleared = output<void>();
  confirmed = output<void>();
  decimalAdded = output<void>();

  onAddNumber(num: string) {
    this.numberAdded.emit(num);
  }

  onAddDecimal() {
    this.decimalAdded.emit();
  }

  onClear() {
    this.cleared.emit();
  }

  onConfirm() {
    this.confirmed.emit();
  }
}
