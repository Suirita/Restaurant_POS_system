import { Component, OnInit, inject, signal } from '@angular/core';
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
  counterSettings = signal<any>({});
  uniqueReference = signal<string>('');

  ngOnInit(): void {
    this.loadCounters();
    this.loadUniqueReference();
  }

  loadUniqueReference(): void {
    const token = this.loginService.getToken();
    if (token) {
      this.configService.getUniqueReference(token).subscribe((ref) => {
        this.uniqueReference.set(ref.value);
      });
    }
  }

  loadCounters(): void {
    const token = this.loginService.getToken();
    if (token) {
      this.configService.getCounters(token).subscribe((data) => {
        this.counters.set(data.value);
        const receiptCounter = data.value.find(
          (c: any) => c.documentType === 4
        );
        if (receiptCounter) {
          this.counterSettings.set(receiptCounter);
        }
      });
    }
  }

  saveCounterSettings(): void {
    const token = this.loginService.getToken();
    if (token) {
      const updatedCounters = this.counters().map((c) => {
        if (c.documentType === 4) {
          return this.counterSettings();
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