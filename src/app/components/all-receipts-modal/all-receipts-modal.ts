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
import { Receipt, Invoice } from '../../types/pos.types';
import { InvoiceService } from '../../invoice.service';
import { ReceiptService } from '../../receipt.service';
import {
  LucideAngularModule,
  X,
  LoaderCircle,
  Clock,
  CreditCard,
  FileText,
  Search,
  Printer,
} from 'lucide-angular';
import { Receipt as ReceiptIcon } from 'lucide-angular';
import { ReceiptDetailsModalComponent } from '../receipt-details-modal/receipt-details-modal';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog';
import { InvoiceDetailsModalComponent } from '../invoice-details-modal/invoice-details-modal';
import { ReusableTable, TableAction } from '../reusable-table/reusable-table';
import { PaginationComponent } from '../pagination/pagination';
import {
  DateRangePickerComponent,
  DateRange,
} from '../date-range-picker/date-range-picker';
import { TableSkeletonComponent } from '../table-skeleton/table-skeleton';
import { CustomSelectComponent, Option } from '../custom-select/custom-select';
import { SearchableSelectComponent } from '../searchable-select/searchable-select';
import { ConfigurationService } from '../../configuration.service';
import { UserService } from '../../user.service';

@Component({
  standalone: true,
  selector: 'app-all-receipts-modal',
  templateUrl: './all-receipts-modal.html',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ReceiptDetailsModalComponent,
    InvoiceDialogComponent,
    InvoiceDetailsModalComponent,
    ReusableTable,
    PaginationComponent,
    DateRangePickerComponent,
    TableSkeletonComponent,
    CustomSelectComponent,
    SearchableSelectComponent,
  ],
})
export class AllReceiptsModalComponent implements AfterViewInit {
  readonly Receipt = ReceiptIcon;
  readonly XIcon = X;
  readonly Loader = LoaderCircle;
  readonly Clock = Clock;
  readonly CreditCard = CreditCard;
  readonly FileText = FileText;
  readonly Search = Search;
  readonly Printer = Printer;

  private receiptService = inject(ReceiptService);
  private invoiceService = inject(InvoiceService);
  private configurationService = inject(ConfigurationService);
  private userService = inject(UserService);
  allReceipts = signal<Receipt[]>([]);
  isLoading = signal<boolean>(false);
  isInvoiceDialogVisible = signal(false);
  isReceiptDetailsVisible = signal(false);
  isInvoiceDetailsVisible = signal(false);
  selectedReceipt = signal<Receipt | null>(null);
  selectedInvoice = signal<Invoice | null>(null);
  selectedReceiptForInvoice = signal<Receipt | null>(null);
  userId = input.required<string>();
  token = input.required<string>();

  // Company info for PDF
  companyInfo = signal<any>(null);
  logoUrl = signal<string | null>(null);

  // Filter signals
  commandNumberFilter = signal<string>('');

  selectedDateRangeFilter = signal<DateRange>(
    (() => {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { from: start, to: end } as DateRange;
    })()
  );
  statusFilter = signal<string>('in_progress');
  responsableFilter = signal<string>('all');

  statusOptions: Option[] = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'accepted', label: 'Accepté' },
    { value: 'refused', label: 'Refusé' },
    { value: 'late', label: 'En retard' },
    { value: 'billed', label: 'Facturé' },
  ];

  responsableOptions = signal<Option[]>([]);

  currentPage = signal<number>(1);
  rowsCount = signal<number>(0);

  constructor() {
    effect(() => {
      this.loadReceipts();
    });
  }

  close = output<void>();
  pay = output<string>();
  receiptSelected = output<Receipt>();

  tableColumns: string[] = [
    'Commande',
    'Service',
    'Responsable',
    'Statut',
    'Temps',
    'Total',
  ];

  tableColumnKeys: string[] = [
    'orderNumber',
    'tableName',
    'responsable',
    'status',
    'date',
    'total',
  ];

  customActions: TableAction[] = [];

  @ViewChild('totalColumnTemplate') totalColumnTemplate!: TemplateRef<any>;
  @ViewChild('dateColumnTemplate') dateColumnTemplate!: TemplateRef<any>;
  @ViewChild('statusColumnTemplate') statusColumnTemplate!: TemplateRef<any>;

  columnTemplates: { [key: string]: TemplateRef<any> } = {};

  private statusLabels: { [key: string]: string } = {
    in_progress: 'En cours',
    accepted: 'Accepté',
    refused: 'Refusé',
    late: 'En retard',
    billed: 'Facturé',
  };

  getStatusLabel(status?: string): string {
    if (!status) return '';
    return this.statusLabels[status] ?? status;
  }

  ngOnInit() {
    this.loadResponsables();
    this.loadCompanyInfo();
    this.customActions = [
      {
        icon: Printer,
        label: 'Imprimer',
        onClick: (receipt: Receipt) => this.onPrintReceipt(receipt),
        isVisible: (receipt: Receipt) => true,
      },
      {
        icon: FileText,
        label: 'Facturer',
        onClick: (receipt: Receipt) => this.onGenerateInvoiceClick(receipt),
        isVisible: (receipt: Receipt) => receipt.status !== 'billed',
      },
      {
        icon: CreditCard,
        label: 'Payer',
        onClick: (receipt: Receipt) => this.onPayClick(receipt.orderNumber),
        isVisible: (receipt: Receipt) =>
          receipt.status !== 'accepted' && receipt.status !== 'billed',
      },
    ];
  }

  ngAfterViewInit() {
    this.columnTemplates = {
      total: this.totalColumnTemplate,
      date: this.dateColumnTemplate,
      status: this.statusColumnTemplate,
    };
  }

  loadResponsables() {
    this.userService.getUsers().subscribe((users) => {
      const options = users.map(
        (user) => ({ value: user.userId, label: user.fullName } as Option)
      );
      this.responsableOptions.set([
        { value: 'all', label: 'Tous les responsables' },
        ...options,
      ]);
    });
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

  loadReceipts() {
    const dateRange = this.selectedDateRangeFilter();
    if (
      (dateRange.from && !dateRange.to) ||
      (!dateRange.from && dateRange.to)
    ) {
      return;
    }

    this.isLoading.set(true);
    const commandNum = this.commandNumberFilter();
    const status = this.statusFilter();
    const responsable = this.responsableFilter();
    let dateStart: string | undefined;
    let dateEnd: string | undefined;

    if (dateRange.from && dateRange.to) {
      const from = dateRange.from;
      dateStart = `${from.getFullYear()}-${(from.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${from.getDate().toString().padStart(2, '0')}T${from
        .getHours()
        .toString()
        .padStart(2, '0')}:${from.getMinutes().toString().padStart(2, '0')}`;
      const to = dateRange.to;
      dateEnd = `${to.getFullYear()}-${(to.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${to.getDate().toString().padStart(2, '0')}T${to
        .getHours()
        .toString()
        .padStart(2, '0')}:${to.getMinutes().toString().padStart(2, '0')}`;
    }

    const techniciansId = responsable === 'all' ? undefined : [responsable];

    this.receiptService
      .getAllReceipts(
        this.token(),
        this.currentPage(),
        10,
        techniciansId,
        status === 'all'
          ? ['in_progress', 'refused', 'late', 'accepted', 'billed']
          : [status],
        commandNum,
        dateStart,
        dateEnd
      )
      .subscribe((response) => {
        this.allReceipts.set(response.receipts);
        this.rowsCount.set(response.totalItems);
        this.isLoading.set(false);
      });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onClose() {
    this.close.emit();
  }

  onPay(orderNumber: string) {
    this.pay.emit(orderNumber);
    this.loadReceipts();
  }

  onPayClick(orderNumber: string) {
    this.onPay(orderNumber);
  }

  onReceiptClick(receipt: Receipt) {
    if (receipt.id) {
      this.receiptService
        .getReceiptDetails(receipt.id, this.token())
        .subscribe({
          next: (detailedReceiptResponse) => {
            const detailedReceipt = detailedReceiptResponse.value;
            if (
              detailedReceipt &&
              detailedReceipt.orderDetails &&
              detailedReceipt.orderDetails.lineItems
            ) {
              const lineItems = detailedReceipt.orderDetails.lineItems.map(
                (item: any) => ({
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
                })
              );

              this.selectedReceipt.set({
                ...receipt,
                items: lineItems,
                total: parseFloat(detailedReceipt.totalTTC.toFixed(2)),
              });
              this.isReceiptDetailsVisible.set(true);
            } else {
              console.error(
                'Detailed receipt or its orderDetails/lineItems are missing:',
                detailedReceiptResponse
              );
            }
          },
          error: (error) => {
            console.error('Error fetching detailed receipt:', error);
          },
        });
    } else {
      console.error('Receipt ID is missing, cannot fetch details.', receipt);
    }
  }

  onCloseReceiptDetails() {
    this.isReceiptDetailsVisible.set(false);
    this.selectedReceipt.set(null);
  }

  onGenerateInvoiceClick(receipt: Receipt) {
    this.selectedReceiptForInvoice.set(receipt);
    this.isInvoiceDialogVisible.set(true);
  }

  onCloseInvoiceDialog() {
    this.isInvoiceDialogVisible.set(false);
    this.selectedReceiptForInvoice.set(null);
  }

  onInvoiceGenerated(invoiceId?: string | null) {
    this.loadReceipts();
    const evt: any = invoiceId as any;
    let id: string | null = null;
    if (typeof invoiceId === 'string') {
      id = invoiceId;
    } else if (evt) {
      id = evt.id ?? evt.value?.id ?? evt.invoiceId ?? evt.data?.id ?? null;
    }
    if (typeof id !== 'string') id = null;
    if (!id) {
      this.onCloseInvoiceDialog();
      this.onClose();
      return;
    }
    this.invoiceService.getInvoiceDetails(id, this.token()).subscribe({
      next: (detailedInvoiceResponse) => {
        const detailedInvoice = detailedInvoiceResponse.value;
        if (
          detailedInvoice &&
          detailedInvoice.orderDetails &&
          detailedInvoice.orderDetails.lineItems
        ) {
          const lineItems = detailedInvoice.orderDetails.lineItems.map(
            (item: any) => ({
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
            })
          );
          this.selectedInvoice.set({
            id: detailedInvoice.id,
            invoiceNumber: detailedInvoice.reference,
            clientName: detailedInvoice.client,
            date: new Date(detailedInvoice.creationDate),
            total: parseFloat(detailedInvoice.totalTTC.toFixed(2)),
            items: lineItems,
          });
          this.isInvoiceDetailsVisible.set(true);
        }
        this.onCloseInvoiceDialog();
      },
      error: () => {
        this.onCloseInvoiceDialog();
      },
    });
  }

  onCloseInvoiceDetails() {
    this.isInvoiceDetailsVisible.set(false);
    this.selectedInvoice.set(null);
  }

  onPrintReceipt(receipt: Receipt) {
    // Get detailed receipt data first
    if (receipt.id) {
      this.receiptService
        .getReceiptDetails(receipt.id, this.token())
        .subscribe({
          next: (detailedReceiptResponse) => {
            const detailedReceipt = detailedReceiptResponse.value;
            if (
              detailedReceipt &&
              detailedReceipt.orderDetails &&
              detailedReceipt.orderDetails.lineItems
            ) {
              const lineItems = detailedReceipt.orderDetails.lineItems.map(
                (item: any) => ({
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
                })
              );

              const receiptToPrint = {
                ...receipt,
                items: lineItems,
                total: parseFloat(detailedReceipt.totalTTC.toFixed(2)),
              };

              this.generatePDF(receiptToPrint);
            }
          },
          error: (error) => {
            console.error(
              'Error fetching detailed receipt for printing:',
              error
            );
          },
        });
    }
  }

  generatePDF(receipt: Receipt) {
    // Create a new window with the receipt content styled like the modal
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const companyName = this.companyInfo()?.companyName || 'Restaurant';
    const companyAddress = this.companyInfo()?.address?.street || '';
    const companyCity = this.companyInfo()?.address?.city || '';
    const companyPostalCode = this.companyInfo()?.address?.postalCode || '';
    const logo = this.logoUrl();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${receipt.orderNumber}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #1f2937;
            margin: 0;
            padding: 20px;
            background: white;
          }
          .receipt {
            max-width: 300px;
            margin: 0 auto;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .header {
            padding: 16px;
            text-align: center;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
          }
          .logo {
            height: 64px;
            width: auto;
            margin: 0 auto 16px;
            display: block;
          }
          .company-name {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          .company-address {
            font-size: 10px;
            color: #6b7280;
          }
          .body {
            padding: 16px;
          }
          .date-time {
            display: flex;
            justify-content: space-between;
            border-top: 1px dashed #9ca3af;
            padding-top: 8px;
            font-size: 10px;
            color: #6b7280;
          }
          .items-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin: 16px 0 8px;
            font-size: 10px;
          }
          .divider {
            border-top: 1px dashed #9ca3af;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 10px;
          }
          .totals {
            margin-top: 16px;
            padding-top: 8px;
            border-top: 1px dashed #9ca3af;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 4px 0;
            font-size: 10px;
          }
          .total-row.final {
            font-weight: bold;
            font-size: 14px;
            margin-top: 8px;
          }
          @media print {
            body { margin: 0; }
            .receipt { border: none; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            ${logo ? `<img src="${logo}" alt="Logo" class="logo">` : ''}
            <div class="company-name">${companyName}</div>
            <div class="company-address">${companyAddress}</div>
            <div class="company-address">${companyCity}, ${companyPostalCode}</div>
          </div>
          <div class="body">
            <div class="date-time">
              <span>${new Date(receipt.date).toLocaleDateString('en-US')}</span>
              <span>${new Date(receipt.date).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}</span>
            </div>
            <div class="items-header">
              <span>QTY</span>
              <span>DESC</span>
              <span>AMT</span>
            </div>
            <div class="divider"></div>
            ${receipt.items
              .map(
                (item) => `
              <div class="item">
                <span>${item.quantity}</span>
                <span>${item.designation}</span>
                <span>${item.sellingPrice.toFixed(2)} €</span>
              </div>
            `
              )
              .join('')}
            <div class="totals">
              <div class="total-row">
                <span>SUBTOTAL</span>
                <span>${receipt.total.toFixed(2)} €</span>
              </div>
              <div class="total-row">
                <span>TAX</span>
                <span>0.00 €</span>
              </div>
              <div class="total-row final">
                <span>TOTAL</span>
                <span>${receipt.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 100);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  clearFilters() {
    this.commandNumberFilter.set('');
    this.selectedDateRangeFilter.set({});
    this.statusFilter.set('all');
    this.responsableFilter.set('all');
  }
}
