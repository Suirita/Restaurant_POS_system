import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-service-selection',
  templateUrl: './service-selection.html',
  imports: [CommonModule],
})
export class ServiceSelectionComponent {
  orderType = input.required<'take away' | 'table'>();

  takeAwaySelected = output<void>();
  tableSelected = output<void>();

  onSelectTakeAway() {
    this.takeAwaySelected.emit();
  }

  onSelectTable() {
    this.tableSelected.emit();
  }
}
