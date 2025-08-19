import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt, Invoice } from '../../../types/pos.types';
import { ReceiptService } from '../../../receipt.service';
import { InvoiceService } from '../../../invoice.service';
import { LoginService } from '../../../login.service';
import {
  LucideAngularModule,
  X,
  LoaderCircle,
  Clock,
  CreditCard,
  FileText,
} from 'lucide-angular';
import { Receipt as ReceiptIcon } from 'lucide-angular';
import { ReceiptDetailsModalComponent } from '../../receipt-details-modal/receipt-details-modal';
import { InvoiceDetailsModalComponent } from '../../invoice-details-modal/invoice-details-modal';
import { InvoiceDialogComponent } from '../../invoice-dialog/invoice-dialog';
import { UserAccount } from '../../../types/pos.types';

@Component({
  standalone: true,
  selector: 'app-receipts',
  imports: [
    CommonModule,
    LucideAngularModule,
    ReceiptDetailsModalComponent,
    InvoiceDialogComponent,
    InvoiceDetailsModalComponent,
  ],
  templateUrl: './receipts.html',
})
export class ReceiptsComponent {
  readonly Receipt = ReceiptIcon;
  readonly XIcon = X;
  readonly Loader = LoaderCircle;
  readonly Clock = Clock;
  readonly CreditCard = CreditCard;
  readonly FileText = FileText;

  private receiptService = inject(ReceiptService);
  private invoiceService = inject(InvoiceService);
  private loginService = inject(LoginService);
  receipts = signal<Receipt[]>([]);
  isLoading = signal<boolean>(false);
  isInvoiceDialogVisible = signal(false);
  isReceiptDetailsVisible = signal(false);
  isInvoiceDetailsVisible = signal(false);
  selectedReceipt = signal<Receipt | null>(null);
  selectedInvoice = signal<Invoice | null>(null);
  selectedReceiptForInvoice = signal<Receipt | null>(null);

  private user: UserAccount | null = null;

  // Pagination
  currentPage = signal<number>(1);
  paginatedReceipts = computed(() => {
    const startIndex = (this.currentPage() - 1) * 8;
    const endIndex = startIndex + 8;
    return this.receipts().slice(startIndex, endIndex);
  });

  constructor() {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
    }
  }

  ngOnInit() {
    this.loadReceipts();
  }

  loadReceipts() {
    if (!this.user || !this.user.token) return;
    this.isLoading.set(true);
    this.receiptService
      .getAllReceipts(this.user.token, [this.user.userId], ['in_progress'])
      .subscribe((receipts: Receipt[]) => {
        this.receipts.set(receipts);
        this.isLoading.set(false);
      });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onPay(orderNumber: string) {
    if (!this.user || !this.user.token) return;
    // This should be handled by a service or an output event
    // For now, just logging it.
    console.log('Pay for order:', orderNumber);
    this.loadReceipts();
  }

  onPayClick(orderNumber: string) {
    this.onPay(orderNumber);
  }

  onReceiptClick(receipt: Receipt) {
    if (!this.user || !this.user.token) return;
    if (receipt.id) {
      this.receiptService
        .getReceiptDetails(receipt.id, this.user.token)
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
    if (!this.user || !this.user.token) return this.onCloseInvoiceDialog();
    if (id) {
      this.invoiceService.getInvoiceDetails(id, this.user.token).subscribe({
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
              total: detailedInvoice.totalTTC,
              items: lineItems,
            });
            this.isInvoiceDetailsVisible.set(true);
          }
          this.onCloseInvoiceDialog();
        },
        error: () => this.onCloseInvoiceDialog(),
      });
    } else {
      this.onCloseInvoiceDialog();
    }
  }

  onCloseInvoiceDetails() {
    this.isInvoiceDetailsVisible.set(false);
    this.selectedInvoice.set(null);
  }

  getToken() {
    return this.user?.token;
  }
}
