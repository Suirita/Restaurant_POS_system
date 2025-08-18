import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-skeleton.html',
})
export class TableSkeletonComponent {
  @Input() columns: string[] = [];
  @Input() rowCount = 10;

  get dummyRows(): any[] {
    return Array(this.rowCount);
  }
}
