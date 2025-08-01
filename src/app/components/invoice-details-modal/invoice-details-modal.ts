import { Component, input, output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice } from '../../types/pos.types';
import { ConfigurationService } from '../../configuration.service';

@Component({
  standalone: true,
  selector: 'app-invoice-details-modal',
  templateUrl: './invoice-details-modal.html',
  imports: [CommonModule],
})
export class InvoiceDetailsModalComponent implements OnInit {
  invoice = input.required<Invoice>();
  close = output<void>();

  private configurationService = inject(ConfigurationService);
  companyInfo = signal<any>(null);
  logoUrl = signal<string | null>(null);

  ngOnInit() {
    this.loadCompanyInfo();
  }

  loadCompanyInfo() {
    this.configurationService.getPdfOptions().subscribe((options: any) => {
      const parsedOptions = typeof options === 'string' ? JSON.parse(options) : options;
      if (parsedOptions && parsedOptions.header) {
        this.companyInfo.set(parsedOptions.header);
      }
    });
    this.configurationService.getInvoiceConfiguration().subscribe((config: any) => {
      if (config && config.images && config.images.logo) {
        this.logoUrl.set(config.images.logo);
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}
