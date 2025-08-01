import { Component, output, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt, UserAccount, Client } from '../../types/pos.types';
import { ReceiptService } from '../../receipt.service';
import { ClientService } from '../../client.service';
import { InvoiceService } from '../../invoice.service';
import { LucideAngularModule, X, LoaderCircle } from 'lucide-angular';
import { ClientFormModalComponent } from '../client-form-modal/client-form-modal';
import { ReceiptDetailsModalComponent } from '../receipt-details-modal/receipt-details-modal';


@Component({
  standalone: true,
  selector: 'app-all-receipts-modal',
  templateUrl: './all-receipts-modal.html',
  imports: [CommonModule, LucideAngularModule, ClientFormModalComponent, ReceiptDetailsModalComponent],
})
export class AllReceiptsModalComponent {
  readonly XIcon = X;
  readonly Loader = LoaderCircle;

  private receiptService = inject(ReceiptService);
  private clientService = inject(ClientService);
  private invoiceService = inject(InvoiceService);
  receipts = signal<Receipt[]>([]);
  clients = signal<Client[]>([]);
  isLoading = signal<boolean>(false);
  isInvoiceDialogVisible = signal(false);
  isClientFormVisible = signal(false);
  isReceiptDetailsVisible = signal(false);
  selectedReceipt = signal<Receipt | null>(null);
  selectedReceiptForInvoice = signal<Receipt | null>(null);
  selectedClientId = signal<string | null>(null);
  userId = input.required<string>();
  token = input.required<string>();

  close = output<void>();
  pay = output<string>();
  receiptSelected = output<Receipt>();

  ngOnInit() {
    this.loadReceipts();
  }

  loadReceipts() {
    this.isLoading.set(true);
    this.receiptService
      .getAllReceipts(this.token(), this.userId(), ['in_progress'])
      .subscribe((receipts: Receipt[]) => {
        this.receipts.set(receipts);
        this.isLoading.set(false);
      });
  }

  loadClients() {
    this.clientService
      .getClients(this.token())
      .subscribe((clients: Client[]) => {
        this.clients.set(clients);
      });
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
      this.receiptService.getReceiptDetails(receipt.id, this.token()).subscribe({
        next: (detailedReceiptResponse) => {
          const detailedReceipt = detailedReceiptResponse.value;
          if (detailedReceipt && detailedReceipt.orderDetails && detailedReceipt.orderDetails.lineItems) {
            const lineItems = detailedReceipt.orderDetails.lineItems.map((item: any) => ({
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

            this.selectedReceipt.set({
              ...receipt,
              items: lineItems,
              total: detailedReceipt.totalTTC,
            });
            this.isReceiptDetailsVisible.set(true);
          } else {
            console.error('Detailed receipt or its orderDetails/lineItems are missing:', detailedReceiptResponse);
          }
        },
        error: (error) => {
          console.error('Error fetching detailed receipt:', error);
        }
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
    if (this.clients().length === 0) {
      this.loadClients();
    }
  }

  onCloseInvoiceDialog() {
    this.isInvoiceDialogVisible.set(false);
    this.selectedReceiptForInvoice.set(null);
  }

  onGenerateInvoice() {
    const receipt = this.selectedReceiptForInvoice();
    const clientId = this.selectedClientId();
    if (receipt && clientId) {
      this.invoiceService
        .createInvoice(receipt, clientId, this.token())
        .subscribe(() => {
          this.receiptService
            .updateReceipt(receipt, this.token(), 'billed')
            .subscribe(() => {
              this.loadReceipts();
              this.onCloseInvoiceDialog();
              this.onClose();
            });
        });
    }
  }

  onClientSelectionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target.value === 'new') {
      this.isClientFormVisible.set(true);
    } else {
      this.selectedClientId.set(target.value);
    }
  }

  closeClientForm() {
    this.isClientFormVisible.set(false);
  }

  onClientSaved() {
    this.loadClients();
    this.closeClientForm();
  }
}