import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table } from '../../types/pos.types';

@Component({
  standalone: true,
  selector: 'app-service-selection',
  templateUrl: './service-selection.html',
  imports: [CommonModule],
})
export class ServiceSelectionComponent {
  orderType = input.required<'take away' | 'table'>();
  tables = input.required<Table[]>();

  takeAwaySelected = output<void>();
  tableTypeSelected = output<void>();
  tableSelected = output<string>();

  onSelectTakeAway() {
    this.takeAwaySelected.emit();
  }

  onSelectTableType() {
    this.tableTypeSelected.emit();
  }

  onSelectSpecificTable(tableName: string) {
    this.tableSelected.emit(tableName);
  }
}
