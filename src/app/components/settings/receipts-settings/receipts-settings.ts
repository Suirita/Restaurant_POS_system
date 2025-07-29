import {
  Component,
  OnInit,
  inject,
  signal,
  effect,
  computed,
  WritableSignal,
} from '@angular/core';
import { KeyboardService } from '../../../keyboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigurationService } from '../../../configuration.service';
import { LoginService } from '../../../login.service';

@Component({
  standalone: true,
  selector: 'app-receipts-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './receipts-settings.html',
})
export class ReceiptsSettingsComponent implements OnInit {
  selectedTab = signal(0);
  private configService = inject(ConfigurationService);
  private loginService = inject(LoginService);
  private keyboardService = inject(KeyboardService);

  counters = signal<any[]>([]);
  receiptCounterSettings: WritableSignal<any | null> = signal(null);
  invoiceCounterSettings: WritableSignal<any | null> = signal(null);
  editableCounterSettings = signal<any | null>(null);
  uniqueReceiptReference = signal<string>('');
  uniqueInvoiceReference = signal<string>('');

  currentCounterSettings = computed(() => {
    return this.selectedTab() === 0
      ? this.receiptCounterSettings()
      : this.invoiceCounterSettings();
  });

  uniqueReference = computed(() => {
    return this.selectedTab() === 0
      ? this.uniqueReceiptReference()
      : this.uniqueInvoiceReference();
  });

  newReferencePreview = computed(() => {
    const settings = this.editableCounterSettings();
    if (!settings) {
      return '';
    }

    let preview = settings.prefix || '';
    const date = new Date();

    switch (Number(settings.dateFormat)) {
      case 1: // Year
        preview += date.getFullYear();
        break;
      case 2: // Year/Month
        preview += `${date.getFullYear()}${(date.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
        break;
    }

    if (settings.counter) {
      preview += (settings.counter.toString() || '').padStart(
        settings.counterLength || 0,
        '0'
      );
    }

    return preview;
  });

  constructor() {
    effect(() => {
      const settings = this.currentCounterSettings();
      if (settings) {
        this.editableCounterSettings.set({ ...settings });
      }
    });
  }

  ngOnInit(): void {
    this.loadCounters();
    this.loadUniqueReferences();
  }

  onSettingsChange(newSettings: any) {
    this.editableCounterSettings.set({ ...newSettings });
  }

  loadUniqueReferences(): void {
    const token = this.loginService.getToken();
    if (token) {
      this.configService.getUniqueReference(token, 4).subscribe((ref) => {
        this.uniqueReceiptReference.set(ref);
      });
      this.configService.getUniqueReference(token, 6).subscribe((ref) => {
        this.uniqueInvoiceReference.set(ref);
      });
    }
  }

  loadCounters(): void {
    const token = this.loginService.getToken();
    if (token) {
      this.configService.getCounters(token).subscribe((data: any) => {
        const countersArray =
          typeof data === 'string' ? JSON.parse(data) : data;
        this.counters.set(countersArray);

        const receiptCounter = countersArray.find(
          (c: any) => c.documentType == 4
        );
        if (receiptCounter) {
          this.receiptCounterSettings.set(receiptCounter);
        }

        const invoiceCounter = countersArray.find(
          (c: any) => c.documentType == 6
        );
        if (invoiceCounter) {
          this.invoiceCounterSettings.set(invoiceCounter);
        }
      });
    }
  }

  saveCounterSettings(): void {
    const token = this.loginService.getToken();
    if (token && this.editableCounterSettings()) {
      const documentType = this.selectedTab() === 0 ? 4 : 6;
      const updatedCounters = this.counters().map((c) => {
        if (c.documentType === documentType) {
          return this.editableCounterSettings();
        }
        return c;
      });

      this.configService
        .updateCounters(token, updatedCounters)
        .subscribe(() => {
          this.loadCounters();
          this.loadUniqueReferences();
        });
    }
  }

  selectTab(index: number): void {
    this.selectedTab.set(index);
    const settings = this.currentCounterSettings();
    if (settings) {
      this.editableCounterSettings.set({ ...settings });
    }
  }

  openKeyboard(): void {
    this.keyboardService.openOnScreenKeyboard();
  }

  closeKeyboard(): void {
    this.keyboardService.closeOnScreenKeyboard();
  }
}
