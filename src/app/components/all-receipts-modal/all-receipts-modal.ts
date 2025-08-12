import { Component, output, inject, input, signal, computed, ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { Receipt } from '../../types/pos.types';
import { ReceiptService } from '../../receipt.service';
import {
  LucideAngularModule,
  X,
  LoaderCircle,
  Clock,
  CreditCard,
  FileText,

} from 'lucide-angular';
import { Receipt as ReceiptIcon } from 'lucide-angular';
import { ReceiptDetailsModalComponent } from '../receipt-details-modal/receipt-details-modal';
import { InvoiceDialogComponent } from '../invoice-dialog/invoice-dialog';
import { ReusableTable, TableAction } from '../reusable-table/reusable-table';

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
    ReusableTable,
  ],
})
export class AllReceiptsModalComponent implements AfterViewInit {
  readonly Receipt = ReceiptIcon;
  readonly XIcon = X;
  readonly Loader = LoaderCircle;
  readonly Clock = Clock;
  readonly CreditCard = CreditCard;
  readonly FileText = FileText;

  private receiptService = inject(ReceiptService);
  receipts = signal<Receipt[]>([]);
  isLoading = signal<boolean>(false);
  isInvoiceDialogVisible = signal(false);
  isReceiptDetailsVisible = signal(false);
  selectedReceipt = signal<Receipt | null>(null);
  selectedReceiptForInvoice = signal<Receipt | null>(null);
  userId = input.required<string>();
  token = input.required<string>();

  // Filter signals
  commandNumberFilter = signal<string>('');
  serviceTypeFilter = signal<string>('all');
  selectedDateFilter = signal<string>('');

  // Pagination
  currentPage = signal<number>(1);

  filteredReceipts = computed(() => {
    let filtered = this.receipts();

    const commandNum = this.commandNumberFilter().toLowerCase();
    if (commandNum) {
      filtered = filtered.filter(receipt =>
        receipt.orderNumber.toLowerCase().includes(commandNum)
      );
    }

    const serviceType = this.serviceTypeFilter();
    if (serviceType !== 'all') {
      filtered = filtered.filter(receipt => {
        if (serviceType === 'table') {
          return receipt.tableName && receipt.tableName.toLowerCase() !== 'take away';
        } else if (serviceType === 'takeaway') {
          return receipt.tableName && receipt.tableName.toLowerCase() === 'take away';
        }
        return true;
      });
    }

    const selectedDate = this.selectedDateFilter();
    if (selectedDate) {
      filtered = filtered.filter(receipt => {
        const receiptDate = new Date(receipt.date).toISOString().split('T')[0];
        return receiptDate === selectedDate;
      });
    }

    return filtered;
  });

  paginatedReceipts = computed(() => {
    const startIndex = (this.currentPage() - 1) * 8;
    const endIndex = startIndex + 8;
    return this.filteredReceipts().slice(startIndex, endIndex);
  });

  close = output<void>();
  pay = output<string>();
  receiptSelected = output<Receipt>();

  tableColumns: string[] = ['Numéro de commande', 'Service', 'Date', 'Total'];
  tableColumnKeys: string[] = ['orderNumber', 'tableName', 'date', 'total'];

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
      .getAllReceipts(this.token(), this.userId(), ['in_progress'])
      .subscribe((receipts: Receipt[]) => {
        this.receipts.set(receipts.map(receipt => ({
          ...receipt,
          date: new Date(receipt.date) // Convert date string to Date object
        })));
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
                total: detailedReceipt.totalTTC,
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

  onInvoiceGenerated() {
    this.loadReceipts();
    this.onCloseInvoiceDialog();
    this.onClose();
  }
}
