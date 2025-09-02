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
  isVisible?: (item: any) => boolean;
}

@Component({
  selector: 'app-expandable-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './expandable-table.html',
})
export class ExpandableTable {
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
  @Input() detailsTemplate!: TemplateRef<any>;

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() rowClicked = new EventEmitter<any>();

  expandedItem: any | null = null;

  toggleRow(item: any) {
    if (this.expandedItem === item) {
      this.expandedItem = null;
    } else {
      this.expandedItem = item;
      this.rowClicked.emit(item);
    }
  }

  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }
}
