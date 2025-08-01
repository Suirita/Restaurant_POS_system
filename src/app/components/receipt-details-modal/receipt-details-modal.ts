import { Component, input, output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt } from '../../types/pos.types';
import { ConfigurationService } from '../../configuration.service';

@Component({
  standalone: true,
  selector: 'app-receipt-details-modal',
  templateUrl: './receipt-details-modal.html',
  imports: [CommonModule],
})
export class ReceiptDetailsModalComponent implements OnInit {
  receipt = input.required<Receipt>();
  close = output<void>();

  private configurationService = inject(ConfigurationService);
  companyInfo = signal<any>(null);
  logoUrl = signal<string | null>(null);

  ngOnInit() {
    this.loadCompanyInfo();
  }

  loadCompanyInfo() {
    this.configurationService.getPdfOptions().subscribe((options: any) => {
      this.companyInfo.set(options.header);
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
