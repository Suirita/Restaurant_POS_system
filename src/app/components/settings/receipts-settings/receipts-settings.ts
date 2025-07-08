import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReceiptNumerationService, ReceiptNumeration } from '../../../receipt-numeration.service';

@Component({
  standalone: true,
  selector: 'app-receipts-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './receipts-settings.html',
})
export class ReceiptsSettingsComponent implements OnInit {
  private receiptNumerationService = inject(ReceiptNumerationService);

  numerations = signal<ReceiptNumeration[]>([]);
  showNumerationForm = signal<boolean>(false);
  editingNumeration = signal<ReceiptNumeration | null>(null);

  newNumeration: Omit<ReceiptNumeration, 'id'> = {
    prefix: '',
    nextNumber: 0,
  };

  ngOnInit(): void {
    this.loadNumerations();
  }

  loadNumerations(): void {
    this.receiptNumerationService.getNumerations().subscribe((numerations) => {
      this.numerations.set(numerations);
    });
  }

  openCreateForm(): void {
    this.editingNumeration.set(null);
    this.newNumeration = { prefix: '', nextNumber: 0 };
    this.showNumerationForm.set(true);
  }

  openEditForm(numeration: ReceiptNumeration): void {
    this.editingNumeration.set(numeration);
    this.newNumeration = { ...numeration }; // Populate form with existing numeration data
    this.showNumerationForm.set(true);
  }

  saveNumeration(): void {
    if (this.editingNumeration()) {
      // Update existing numeration
      this.receiptNumerationService.updateNumeration(this.editingNumeration()!).subscribe(() => {
        this.loadNumerations();
        this.showNumerationForm.set(false);
      });
    } else {
      // Create new numeration
      this.receiptNumerationService.createNumeration(this.newNumeration.prefix, this.newNumeration.nextNumber).subscribe(() => {
        this.loadNumerations();
        this.showNumerationForm.set(false);
      });
    }
  }

  deleteNumeration(numerationId: string): void {
    if (confirm('Are you sure you want to delete this numeration rule?')) {
      this.receiptNumerationService.deleteNumeration(numerationId).subscribe(() => {
        this.loadNumerations();
      });
    }
  }

  cancelForm(): void {
    this.showNumerationForm.set(false);
    this.editingNumeration.set(null);
  }
}
