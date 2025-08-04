import { Component, input, output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client, Invoice } from '../../types/pos.types';
import { ConfigurationService } from '../../configuration.service';
import { ClientService } from '../../client.service';
import { LoginService } from '../../login.service';

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
  private clientService = inject(ClientService);
  private loginService = inject(LoginService);

  companyInfo = signal<any>(null);
  logoUrl = signal<string | null>(null);
  client = signal<Client | null>(null);

  ngOnInit() {
    this.loadCompanyInfo();
    this.loadClientInfo();
  }

  loadClientInfo() {
    const token = this.loginService.getToken();
    if (token) {
      this.clientService.getClients(token).subscribe((clients) => {
        this.client.set(
          clients.find(
            (c) => c.name.trim() === this.invoice().clientName.trim()
          ) ?? null
        );
      });
    }
  }

  loadCompanyInfo() {
    this.configurationService.getPdfOptions().subscribe((options: any) => {
      const parsedOptions =
        typeof options === 'string' ? JSON.parse(options) : options;
      if (parsedOptions && parsedOptions.header) {
        this.companyInfo.set(parsedOptions.header);
      }
    });
    this.configurationService
      .getInvoiceConfiguration()
      .subscribe((config: any) => {
        if (config && config.images && config.images.logo) {
          this.logoUrl.set(config.images.logo);
        }
      });
  }

  onClose() {
    this.close.emit();
  }
}
