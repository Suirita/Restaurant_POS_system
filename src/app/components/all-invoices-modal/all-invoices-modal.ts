import {
  Component,
  output,
  inject,
  input,
  signal,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invoice, CartItem, Client } from '../../types/pos.types';
import { InvoiceService } from '../../invoice.service';
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
  Printer,
} from 'lucide-angular';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal';
import { ReusableTable, TableAction } from '../reusable-table/reusable-table';
import { PaginationComponent } from '../pagination/pagination';
import { TableSkeletonComponent } from '../table-skeleton/table-skeleton';
import {
  DateRangePickerComponent,
  DateRange,
} from '../date-range-picker/date-range-picker';
import { ConfigurationService } from '../../configuration.service';
import { ClientService } from '../../client.service';

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
    PaginationComponent,
    TableSkeletonComponent,
    DateRangePickerComponent,
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
  readonly Printer = Printer;

  private invoiceService = inject(InvoiceService);
  private clientService = inject(ClientService);
  private configurationService = inject(ConfigurationService);

  allInvoices = signal<Invoice[]>([]);
  isLoading = signal<boolean>(false);
  token = input.required<string>();

  isInvoiceDetailsVisible = signal(false);
  selectedInvoice = signal<Invoice | null>(null);

  // Company info
  companyInfo = signal<any>(null);
  logoUrl = signal<string | null>(null);

  // Filters
  searchQuery = signal<string>('');
  selectedDateRangeFilter = signal<DateRange>({});

  // Pagination
  currentPage = signal<number>(1);
  rowsCount = signal<number>(0);

  constructor() {
    effect(() => {
      this.loadInvoices();
    });
  }

  close = output<void>();

  // Table configuration
  tableColumns: string[] = [
    'Numéro de facture',
    'Client',
    'Date',
    'Total',
  ];
  tableColumnKeys: string[] = [
    'invoiceNumber',
    'clientName',
    'date',
    'total',
  ];
  customActions: TableAction[] = [];

  @ViewChild('totalColumnTemplate') totalColumnTemplate!: TemplateRef<any>;
  @ViewChild('dateColumnTemplate') dateColumnTemplate!: TemplateRef<any>;
  columnTemplates: { [key: string]: TemplateRef<any> } = {};

  ngOnInit() {
    this.loadCompanyInfo();
    this.customActions = [
      {
        icon: MessageCircle,
        label: 'Envoyer',
        onClick: (invoice: Invoice) => this.sendWhatsapp(invoice),
      },
      {
        icon: Printer,
        label: 'Imprimer',
        onClick: (invoice: Invoice) => this.onPrintInvoice(invoice),
      },
    ];
  }

  ngAfterViewInit() {
    this.columnTemplates = {
      total: this.totalColumnTemplate,
      date: this.dateColumnTemplate,
    };
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

  loadInvoices() {
    const dateRange = this.selectedDateRangeFilter();
    if ((dateRange.from && !dateRange.to) || (!dateRange.from && dateRange.to)) {
      return;
    }

    this.isLoading.set(true);
    const page = this.currentPage();
    const pageSize = 10;
    const searchQuery = this.searchQuery();
    let dateStart: string | undefined;
    let dateEnd: string | undefined;

    if (dateRange.from && dateRange.to) {
      const from = dateRange.from;
      dateStart = `${from.getFullYear()}-${(from.getMonth() + 1).toString().padStart(2, '0')}-${from.getDate().toString().padStart(2, '0')}T${from.getHours().toString().padStart(2, '0')}:${from.getMinutes().toString().padStart(2, '0')}`;
      const to = dateRange.to;
      dateEnd = `${to.getFullYear()}-${(to.getMonth() + 1).toString().padStart(2, '0')}-${to.getDate().toString().padStart(2, '0')}T${to.getHours().toString().padStart(2, '0')}:${to.getMinutes().toString().padStart(2, '0')}`;
    }

    this.invoiceService
      .getAllInvoices(
        this.token(),
        page,
        pageSize,
        searchQuery,
        dateStart,
        dateEnd
      )
      .subscribe((response) => {
        this.allInvoices.set(response.invoices);
        this.rowsCount.set(response.totalItems);
        this.isLoading.set(false);
      });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedDateRangeFilter.set({});
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
                total: parseFloat(detailedInvoice.totalTTC.toFixed(2)),
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

  onPrintInvoice(invoice: Invoice) {
    if (!invoice.id) return;
    this.invoiceService.getInvoiceDetails(invoice.id, this.token()).subscribe({
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

          const invoiceToPrint = {
            ...invoice,
            items: lineItems,
            total: parseFloat(detailedInvoice.totalTTC.toFixed(2)),
          } as Invoice;

          this.generateInvoicePDF(invoiceToPrint);
        }
      },
      error: (error) => {
        console.error('Error fetching detailed invoice for printing:', error);
      },
    });
  }

  generateInvoicePDF(invoice: Invoice) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const companyName = this.companyInfo()?.companyName || 'Restaurant';
    const companyAddress = this.companyInfo()?.address?.street || '';
    const companyCity = this.companyInfo()?.address?.city || '';
    const companyPostalCode = this.companyInfo()?.address?.postalCode || '';
    const companyPhone = this.companyInfo()?.phoneNumber || '';
    const logo = this.logoUrl();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Facture - ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"; color: #1f2937; margin: 0; padding: 24px; background: #ffffff; }
          .container { max-width: 768px; margin: 0 auto; }
          .card { background: #ffffff; border-radius: 12px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); padding: 16px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
          .title { font-size: 24px; font-weight: 800; color: #065f46; margin: 0 0 4px; }
          .subtitle { font-size: 14px; color: #4b5563; margin: 0; }
          .date { font-size: 12px; color: #6b7280; margin-top: 4px; }
          .logo { height: 96px; }
          .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; margin-bottom: 24px; }
          .section-title { font-size: 14px; font-weight: 700; color: #065f46; margin: 0 0 8px; }
          .text-sm { font-size: 14px; color: #374151; margin: 2px 0; }
          .items-header, .item-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 16px; }
          .items-header { padding: 8px 0; border-bottom: 2px solid #d1d5db; font-weight: 700; color: #065f46; font-size: 14px; }
          .item-row { padding: 6px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
          .text-right { text-align: right; }
          .totals { display: flex; justify-content: flex-end; margin: 24px 0; }
          .totals-box { width: 50%; }
          .total-line { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
          .grand-total { border-top: 2px solid #d1d5db; margin-top: 8px; padding-top: 8px; font-weight: 700; font-size: 18px; color: #065f46; }
          .section { margin-bottom: 16px; }
          .terms { font-size: 12px; color: #374151; }
          @media print { body { padding: 0; } .card { box-shadow: none; border: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <div>
                <h1 class="title">Facture</h1>
                <p class="subtitle">N°: ${invoice.invoiceNumber ?? ''}</p>
                <p class="date">Date: ${new Date(
                  invoice.date
                ).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                ${logo ? `<img src="${logo}" alt="Logo" class="logo" />` : ''}
              </div>
            </div>

            <div class="grid">
              <div>
                <h3 class="section-title">CLIENT</h3>
                <p class="text-sm">${invoice.clientName ?? ''}</p>
                <p class="text-sm">${invoice['clientICE'] ?? ''}</p>
                <p class="text-sm">${invoice['clientAddress'] ?? ''}</p>
                <p class="text-sm">${invoice['clientPhoneNumber'] ?? ''}</p>
              </div>
              <div>
                <h3 class="section-title">DE</h3>
                <p class="text-sm">${companyName}</p>
                <p class="text-sm">${companyAddress}</p>
                <p class="text-sm">${companyCity}, ${companyPostalCode}</p>
                <p class="text-sm">${companyPhone}</p>
              </div>
            </div>

            <div class="section">
              <div class="items-header">
                <span>DÉSIGNATION</span>
                <span class="text-right">PRIX</span>
                <span class="text-right">QTÉ</span>
                <span class="text-right">TOTAL</span>
              </div>
              ${(invoice.items || [])
                .map(
                  (item: any) => `
                <div class="item-row">
                  <span>${item.designation}</span>
                  <span class="text-right">${(item.sellingPrice ?? 0).toFixed(
                    2
                  )} €</span>
                  <span class="text-right">${item.quantity ?? 1}</span>
                  <span class="text-right">${(
                    (item.sellingPrice ?? 0) * (item.quantity ?? 1)
                  ).toFixed(2)} €</span>
                </div>
              `
                )
                .join('')}
            </div>

            <div class="totals">
              <div class="totals-box">
                <div class="total-line">
                  <span class="text-sm"><strong>SOUS-TOTAL:</strong></span>
                  <span class="text-sm">${invoice.total.toFixed(2)} €</span>
                </div>
                <div class="total-line">
                  <span class="text-sm"><strong>TAXE:</strong></span>
                  <span class="text-sm">0.00 €</span>
                </div>
                <div class="total-line grand-total">
                  <span>TOTAL:</span>
                  <span>${invoice.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div class="section">
              <h3 class="section-title">INFORMATIONS DE PAIEMENT</h3>
              <p class="text-sm">Compte: ${
                invoice['paymentInfoAccount'] ?? ''
              }</p>
              <p class="text-sm">Nom: ${invoice['paymentInfoName'] ?? ''}</p>
              <p class="text-sm">Détails: ${
                invoice['paymentInfoDetails'] ?? ''
              }</p>
            </div>

            <div class="section">
              <h3 class="section-title">TERMES ET CONDITIONS</h3>
              <p class="terms">${invoice['termsAndConditions'] ?? ''}</p>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); setTimeout(function(){ window.close(); }, 100); };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  sendWhatsapp(invoice: Invoice) {
    this.clientService
      .getClients(this.token())
      .subscribe((clients: Client[]) => {
        const client = clients.find(
          (c) =>
            c.name.trim().toLowerCase() ===
            invoice.clientName.trim().toLowerCase()
        );

        if (client && client.mobile) {
          const message = `Bonjour ${invoice.clientName},nnVoici les détails de votre facture ${invoice.invoiceNumber}:nTotal: ${invoice.total.toFixed(2)} EURnDate: ${new Date(invoice.date).toLocaleDateString()}`;
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
