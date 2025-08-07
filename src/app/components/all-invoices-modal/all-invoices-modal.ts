import { Component, output, inject, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice, CartItem } from '../../types/pos.types';
import { InvoiceService } from '../../invoice.service';
import { LucideAngularModule, X, LoaderCircle, MessageCircle, Phone } from 'lucide-angular';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal';

@Component({
  standalone: true,
  selector: 'app-all-invoices-modal',
  templateUrl: './all-invoices-modal.html',
  imports: [
    CommonModule,
    LucideAngularModule,
    InvoiceDetailsModalComponent,
  ],
})
export class AllInvoicesModalComponent {
  readonly XIcon = X;
  readonly Loader = LoaderCircle;
  readonly MessageCircle = MessageCircle;
  readonly Phone = Phone;

  private invoiceService = inject(InvoiceService);
  invoices = signal<Invoice[]>([]);
  isLoading = signal<boolean>(false);
  token = input.required<string>();

  isInvoiceDetailsVisible = signal(false);
  selectedInvoice = signal<Invoice | null>(null);

  // Pagination
  currentPage = signal<number>(1);
  paginatedInvoices = computed(() => {
    const startIndex = (this.currentPage() - 1) * 9;
    const endIndex = startIndex + 9;
    return this.invoices().slice(startIndex, endIndex);
  });

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

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onClose() {
    this.close.emit();
  }

  onInvoiceClick(invoice: Invoice) {
    if (invoice.id) {
      this.invoiceService.getInvoiceDetails(invoice.id, this.token()).subscribe({
        next: (detailedInvoiceResponse) => {
          const detailedInvoice = detailedInvoiceResponse.value;
          if (detailedInvoice && detailedInvoice.orderDetails && detailedInvoice.orderDetails.lineItems) {
            const lineItems: CartItem[] = detailedInvoice.orderDetails.lineItems.map((item: any) => ({
              id: item.product.id,
              designation: item.product.designation,
              sellingPrice: item.product.sellingPrice,
              purchasePrice: item.product.purchasePrice || 0,
              totalTTC: item.totalTTC,
              tva: item.product.vat || 0,
              categoryId: item.product.categoryId,
              categoryLabel: item.product.categoryLabel,
              image: '',
              quantity: item.quantity,
              labels: item.product.labels || [],
            }));

            this.selectedInvoice.set({
              ...invoice,
              items: lineItems,
              total: detailedInvoice.totalTTC,
            });
            this.isInvoiceDetailsVisible.set(true);
          } else {
            console.error('Detailed invoice or its orderDetails/lineItems are missing:', detailedInvoiceResponse);
          }
        },
        error: (error) => {
          console.error('Error fetching detailed invoice:', error);
        }
      });
    } else {
      console.error('Invoice ID is missing, cannot fetch details.', invoice);
    }
  }

  onCloseInvoiceDetails() {
    this.isInvoiceDetailsVisible.set(false);
    this.selectedInvoice.set(null);
  }

  sendWhatsapp(invoice: Invoice) {
    // Implement your WhatsApp logic here
    console.log('Sending invoice via WhatsApp:', invoice);
  }
}
