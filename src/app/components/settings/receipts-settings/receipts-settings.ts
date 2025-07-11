import {
  Component,
  OnInit,
  inject,
  signal,
  effect,
  computed,
} from '@angular/core';
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
  private configService = inject(ConfigurationService);
  private loginService = inject(LoginService);

  counters = signal<any[]>([]);
  counterSettings = signal<any | null>(null);
  editableCounterSettings = signal<any | null>(null);
  uniqueReference = signal<string>('');

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
      const settings = this.counterSettings();
      if (settings) {
        this.editableCounterSettings.set({ ...settings });
      }
    });
  }

  ngOnInit(): void {
    this.loadCounters();
    this.loadUniqueReference();
  }

  onSettingsChange(newSettings: any) {
    this.editableCounterSettings.set({ ...newSettings });
  }

  loadUniqueReference(): void {
    const token = this.loginService.getToken();
    if (token) {
      this.configService.getUniqueReference(token).subscribe((ref) => {
        this.uniqueReference.set(ref);
      });
    }
  }

  loadCounters(): void {
    const token = this.loginService.getToken();
    if (token) {
      this.configService.getCounters(token).subscribe((data: any) => {
        if (typeof data === 'string') {
          const countersArray = JSON.parse(data);
          this.counters.set(countersArray);
          const receiptCounter = countersArray.find(
            (c: any) => c.documentType == 4
          );
          if (receiptCounter) {
            this.counterSettings.set(receiptCounter);
          }
        } else {
          this.counters.set(data);
          const receiptCounter = data.find((c: any) => c.documentType == 4);
          if (receiptCounter) {
            this.counterSettings.set(receiptCounter);
          }
        }
      });
    }
  }

  saveCounterSettings(): void {
    const token = this.loginService.getToken();
    if (token && this.editableCounterSettings()) {
      const updatedCounters = this.counters().map((c) => {
        if (c.documentType === 4) {
          return this.editableCounterSettings();
        }
        return c;
      });

      this.configService
        .updateCounters(token, updatedCounters)
        .subscribe(() => {
          this.loadCounters();
          this.loadUniqueReference();
        });
    }
  }
}