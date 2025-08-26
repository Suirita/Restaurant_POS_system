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
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
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

@Component({
  standalone: true,
  selector: 'app-all-receipts-modal',
  templateUrl: './all-receipts-modal.html',
  imports: [
    CommonModule,
    FormsModule, // Add FormsModule here
    LucideAngularModule,
    ReceiptDetailsModalComponent,
    InvoiceDialogComponent,
    InvoiceDetailsModalComponent,
    ReusableTable,
    PaginationComponent,
    DateRangePickerComponent,
    TableSkeletonComponent,
    CustomSelectComponent,
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

  private receiptService = inject(ReceiptService);
  private invoiceService = inject(InvoiceService);
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

  // Filter signals
  commandNumberFilter = signal<string>('');
  serviceTypeFilter = signal<string>('all');
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

  statusOptions: Option[] = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'in_progress', label: 'En cours' },
    { value: 'accepted', label: 'Accepté' },
    { value: 'refused', label: 'Refusé' },
    { value: 'late', label: 'En retard' },
    { value: 'billed', label: 'Facturé' },
  ];

  // Pagination
  currentPage = signal<number>(1);
  rowsCount = signal<number>(0);

  filteredReceipts = computed(() => {
    let filtered = this.allReceipts();

    const commandNum = this.commandNumberFilter().toLowerCase();
    if (commandNum) {
      filtered = filtered.filter((receipt) =>
        receipt.orderNumber.toLowerCase().includes(commandNum)
      );
    }

    const serviceType = this.serviceTypeFilter();
    if (serviceType !== 'all') {
      filtered = filtered.filter((receipt) => {
        if (serviceType === 'table') {
          return (
            receipt.tableName && receipt.tableName.toLowerCase() !== 'take away'
          );
        } else if (serviceType === 'takeaway') {
          return (
            receipt.tableName && receipt.tableName.toLowerCase() === 'take away'
          );
        }
        return true;
      });
    }

    const selectedDateRange = this.selectedDateRangeFilter();
    if (selectedDateRange.from && selectedDateRange.to) {
      const from = new Date(selectedDateRange.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(selectedDateRange.to);
      to.setHours(23, 59, 59, 999);

      filtered = filtered.filter((receipt) => {
        const receiptDate = new Date(receipt.date);
        return receiptDate >= from && receiptDate <= to;
      });
    } else if (selectedDateRange.from) {
      const fromDayStart = new Date(selectedDateRange.from);
      fromDayStart.setHours(0, 0, 0, 0);
      const fromDayEnd = new Date(selectedDateRange.from);
      fromDayEnd.setHours(23, 59, 59, 999);

      filtered = filtered.filter((receipt) => {
        const receiptDate = new Date(receipt.date);
        return receiptDate >= fromDayStart && receiptDate <= fromDayEnd;
      });
    }

    const status = this.statusFilter();
    if (status !== 'all') {
      filtered = filtered.filter((receipt) => receipt.status === status);
    }

    return filtered;
  });

  paginatedReceipts = computed(() => {
    const filtered = this.filteredReceipts();
    const start = (this.currentPage() - 1) * 10;
    const end = start + 10;
    return filtered.slice(start, end);
  });

  constructor() {
    effect(() => {
      this.rowsCount.set(this.filteredReceipts().length);
      if (this.currentPage() > Math.ceil(this.rowsCount() / 10)) {
        this.currentPage.set(1);
      }
    });
  }

  close = output<void>();
  pay = output<string>();
  receiptSelected = output<Receipt>();

  tableColumns: string[] = [
    'Numéro de commande',
    'Service',
    'Responsable',
    'Date',
    'Total',
    'Statut',
  ];
  tableColumnKeys: string[] = [
    'orderNumber',
    'tableName',
    'responsable',
    'date',
    'total',
    'status',
  ];

  customActions: TableAction[] = [];

  @ViewChild('totalColumnTemplate') totalColumnTemplate!: TemplateRef<any>;
  @ViewChild('dateColumnTemplate') dateColumnTemplate!: TemplateRef<any>;

  columnTemplates: { [key: string]: TemplateRef<any> } = {};

  ngOnInit() {
    this.loadReceipts();
    this.customActions = [
      {
        icon: FileText,
        label: 'Facturer',
        onClick: (receipt: Receipt) => this.onGenerateInvoiceClick(receipt),
      },
      {
        icon: CreditCard,
        label: 'Payer',
        onClick: (receipt: Receipt) => this.onPayClick(receipt.orderNumber),
      },
    ];
  }

  ngAfterViewInit() {
    this.columnTemplates = {
      total: this.totalColumnTemplate,
      date: this.dateColumnTemplate,
    };
  }

  loadReceipts() {
    this.isLoading.set(true);
    this.receiptService
      .getAllReceipts(
        this.token(),
        1,
        10000,
        [this.userId()],
        ['in_progress', 'refused', 'late', 'accepted', 'billed']
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

  clearFilters() {
    this.commandNumberFilter.set('');
    this.serviceTypeFilter.set('all');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setHours(23, 59, 59, 999);
    this.selectedDateRangeFilter.set({ from: today, to: end });
    this.statusFilter.set('in_progress');
  }
}
