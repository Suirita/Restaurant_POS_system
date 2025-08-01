import { Component, OnInit, signal, inject } from '@angular/core';
import { KeyboardService } from '../../../keyboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table } from '../../../types/pos.types';
import { LucideAngularModule, Edit, Trash2, X } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-rooms-settings',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './rooms-settings.html',
})
export class RoomsSettingsComponent implements OnInit {
  readonly edit = Edit;
  readonly trash2 = Trash2;
  readonly XIcon = X;

  private keyboardService = inject(KeyboardService);

  tables = signal<Table[]>([]);
  showTableForm = signal<boolean>(false);
  editingTable = signal<Table | null>(null);

  newTableName: string = '';

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    // In a real application, this would be fetched from a service.
    // For now, we'll use localStorage or a default set.
    const storedTables = localStorage.getItem('tables');
    if (storedTables) {
      this.tables.set(JSON.parse(storedTables));
    } else {
      // Default tables if none in localStorage
      const defaultTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
        name: `T${i + 1}`,
        occupied: false,
        userId: null,
      }));
      this.tables.set(defaultTables);
      this.saveTables();
    }
  }

  private saveTables(): void {
    localStorage.setItem('tables', JSON.stringify(this.tables()));
  }

  openCreateForm(): void {
    this.editingTable.set(null);
    this.newTableName = '';
    this.showTableForm.set(true);
  }

  openEditForm(table: Table): void {
    this.editingTable.set(table);
    this.newTableName = table.name; // Populate form with existing table name
    this.showTableForm.set(true);
  }

  saveTable(): void {
    if (this.editingTable()) {
      // Update existing table
      const updatedTables = this.tables().map((t) =>
        t.name === this.editingTable()!.name
          ? { ...t, name: this.newTableName }
          : t
      );
      this.tables.set(updatedTables);
    } else {
      // Create new table
      const newTable: Table = {
        name: this.newTableName,
        occupied: false,
        userId: null,
      };
      this.tables.set([...this.tables(), newTable]);
    }
    this.saveTables();
    this.showTableForm.set(false);
  }

  deleteTable(tableName: string): void {
    if (confirm('Are you sure you want to delete this table?')) {
      this.tables.set(this.tables().filter((t) => t.name !== tableName));
      this.saveTables();
    }
  }

  cancelForm(): void {
    this.showTableForm.set(false);
    this.editingTable.set(null);
  }

  openKeyboard(): void {
    this.keyboardService.openOnScreenKeyboard();
  }
}
