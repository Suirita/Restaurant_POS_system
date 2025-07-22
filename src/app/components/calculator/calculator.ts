import { Component, input, output } from '@angular/core';
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
