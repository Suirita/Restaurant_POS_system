import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './reusable-table.html',
})
export class ReusableTable {
  @Input() columns: string[] = [];
  @Input() columnKeys: string[] = [];
  @Input() data: any[] = [];
  @Input() actions: {
    edit?: boolean;
    delete?: boolean;
  } = {};
  @Input() imagePath?: string;
  @Input() onImageError!: (event: Event) => void;

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }
}
