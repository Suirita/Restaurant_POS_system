import {
  Component,
  output,
  inject,
  input,
  signal,
  computed,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  Search,
} from 'lucide-angular';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal';
import { ReusableTable, TableAction } from '../reusable-table/reusable-table';

@Component({
  standalone: true,
  selector: 'app-all-invoices-modal',
  templateUrl: './all-invoices-modal.html',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    InvoiceDetailsModalComponent,
    ReusableTable,
  ],
})
export class AllInvoicesModalComponent implements AfterViewInit {
  readonly ReceiptText = ReceiptText;
  readonly XIcon = X;
  readonly Loader = LoaderCircle;
  readonly Clock = Clock;
  readonly User = User;
  readonly MessageCircle = MessageCircle;
  readonly Phone = Phone;
  readonly Search = Search;

  private invoiceService = inject(InvoiceService);
  private clientService = inject(ClientService);
  invoices = signal<Invoice[]>([]);
  isLoading = signal<boolean>(false);
  token = input.required<string>();

  isInvoiceDetailsVisible = signal(false);
  selectedInvoice = signal<Invoice | null>(null);

  // Filters
  invoiceNumberFilter = signal<string>('');
  clientNameFilter = signal<string>('');
  selectedDateFilter = signal<string>('');

  // Pagination
  currentPage = signal<number>(1);
  filteredInvoices = computed(() => {
    let filtered = this.invoices();

    const invoiceTerm = this.invoiceNumberFilter().trim().toLowerCase();
    if (invoiceTerm) {
      filtered = filtered.filter((inv) =>
        inv.invoiceNumber?.toLowerCase().includes(invoiceTerm)
      );
    }

    const clientTerm = this.clientNameFilter().trim().toLowerCase();
    if (clientTerm) {
      filtered = filtered.filter((inv) =>
        inv.clientName?.toLowerCase().includes(clientTerm)
      );
    }

    const selectedDate = this.selectedDateFilter();
    if (selectedDate) {
      filtered = filtered.filter((inv) => {
        const dateOnly = new Date(inv.date).toISOString().split('T')[0];
        return dateOnly === selectedDate;
      });
    }

    return filtered;
  });
  paginatedInvoices = computed(() => {
    const startIndex = (this.currentPage() - 1) * 9;
    const endIndex = startIndex + 9;
    return this.filteredInvoices().slice(startIndex, endIndex);
  });

  close = output<void>();

  // Table configuration
  tableColumns: string[] = ['Numéro de facture', 'Client', 'Date', 'Total'];
  tableColumnKeys: string[] = ['invoiceNumber', 'clientName', 'date', 'total'];
  customActions: TableAction[] = [];

  @ViewChild('totalColumnTemplate') totalColumnTemplate!: TemplateRef<any>;
  @ViewChild('dateColumnTemplate') dateColumnTemplate!: TemplateRef<any>;
  columnTemplates: { [key: string]: TemplateRef<any> } = {};

  ngOnInit() {
    this.loadInvoices();
    this.customActions = [
      {
        icon: MessageCircle,
        label: 'Envoyer',
        onClick: (invoice: Invoice) => this.sendWhatsapp(invoice),
      },
    ];
  }

  ngAfterViewInit() {
    this.columnTemplates = {
      total: this.totalColumnTemplate,
      date: this.dateColumnTemplate,
    };
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
    this.clientService
      .getClients(this.token())
      .subscribe((clients: Client[]) => {
        console.log('All clients:', clients);
        console.log('Searching for client name:', invoice.clientName);

        const client = clients.find(
          (c) =>
            c.name.trim().toLowerCase() ===
            invoice.clientName.trim().toLowerCase()
        );

        console.log('Found client:', client);

        if (client && client.mobile) {
          const message = `Bonjour ${invoice.clientName},

Voici les détails de votre facture ${invoice.invoiceNumber}:
Total: ${invoice.total} EUR
Date: ${new Date(invoice.date).toLocaleDateString()}`;
          const whatsappUrl = `https://wa.me/${
            client.mobile
          }?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
        } else {
          alert('Numéro de téléphone du client non trouvé.');
        }
      });
  }
}
