import { Component, output, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice } from '../../types/pos.types';
import { InvoiceService } from '../../invoice.service';
import { LucideAngularModule, X, LoaderCircle, MessageCircle } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-all-invoices-modal',
  templateUrl: './all-invoices-modal.html',
  imports: [CommonModule, LucideAngularModule],
})
export class AllInvoicesModalComponent {
  readonly XIcon = X;
  readonly Loader = LoaderCircle;
  readonly MessageCircleIcon = MessageCircle;

  private invoiceService = inject(InvoiceService);
  invoices = signal<Invoice[]>([]);
  isLoading = signal<boolean>(false);
  token = input.required<string>();

  close = output<void>();

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.isLoading.set(true);
    this.invoiceService
      .getAllInvoices(this.token())
      .subscribe((response: any) => {
        const mappedInvoices: Invoice[] = response.value.map(
          (apiInvoice: any) => ({
            id: apiInvoice.id,
            invoiceNumber: apiInvoice.reference,
            clientName: apiInvoice.client,
            date: new Date(apiInvoice.creationDate),
            total: apiInvoice.totalTTC,
          })
        );
        this.invoices.set(mappedInvoices);
        this.isLoading.set(false);
      });
  }

  onClose() {
    this.close.emit();
  }

  sendWhatsapp(invoice: Invoice) {
    // Implement your WhatsApp logic here
    console.log('Sending invoice via WhatsApp:', invoice);
  }
}
