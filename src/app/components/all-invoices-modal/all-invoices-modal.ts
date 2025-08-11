import {
  Component,
  output,
  inject,
  input,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Invoice, CartItem, Client } from '../../types/pos.types';
import { InvoiceService } from '../../invoice.service';
import { ClientService } from '../../client.service';
import {
  LucideAngularModule,
  ReceiptText,
  X,
  LoaderCircle,
  Clock,
  User,
  MessageCircle,
  Phone,
} from 'lucide-angular';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal';

@Component({
  standalone: true,
  selector: 'app-all-invoices-modal',
  templateUrl: './all-invoices-modal.html',
  imports: [CommonModule, LucideAngularModule, InvoiceDetailsModalComponent],
})
export class AllInvoicesModalComponent {
  readonly ReceiptText = ReceiptText;
  readonly XIcon = X;
  readonly Loader = LoaderCircle;
  readonly Clock = Clock;
  readonly User = User;
  readonly MessageCircle = MessageCircle;
  readonly Phone = Phone;

  private invoiceService = inject(InvoiceService);
  private clientService = inject(ClientService);
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
      this.invoiceService
        .getInvoiceDetails(invoice.id, this.token())
        .subscribe({
          next: (detailedInvoiceResponse) => {
            const detailedInvoice = detailedInvoiceResponse.value;
            if (
              detailedInvoice &&
              detailedInvoice.orderDetails &&
              detailedInvoice.orderDetails.lineItems
            ) {
              const lineItems: CartItem[] = 
                detailedInvoice.orderDetails.lineItems.map((item: any) => ({
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
              console.error(
                'Detailed invoice or its orderDetails/lineItems are missing:',
                detailedInvoiceResponse
              );
            }
          },
          error: (error) => {
            console.error('Error fetching detailed invoice:', error);
          },
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
    this.clientService.getClients(this.token()).subscribe((clients: Client[]) => {
      console.log('All clients:', clients);
      console.log('Searching for client name:', invoice.clientName);

      const client = clients.find(c => c.name.trim().toLowerCase() === invoice.clientName.trim().toLowerCase());
      
      console.log('Found client:', client);

      if (client && client.mobile) {
        const message = `Bonjour ${invoice.clientName},

Voici les détails de votre facture ${invoice.invoiceNumber}:
Total: ${invoice.total} EUR
Date: ${new Date(invoice.date).toLocaleDateString()}`;
        const whatsappUrl = `https://wa.me/${client.mobile}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      } else {
        alert('Numéro de téléphone du client non trouvé.');
      }
    });
  }
}
