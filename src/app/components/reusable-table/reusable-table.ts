import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

export interface TableAction {
  icon: any; // Lucide icon name
  label: string;
  onClick: (item: any) => void;
}

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
  @Input() customActions: TableAction[] = [];
  @Input() columnTemplates: { [key: string]: TemplateRef<any> } = {};

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onRowClick = new EventEmitter<any>();

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }
}
