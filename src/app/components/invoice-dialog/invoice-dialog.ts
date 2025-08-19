import { Component, output, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Receipt, Client } from '../../types/pos.types';
import { ClientService } from '../../client.service';
import { InvoiceService } from '../../invoice.service';
import {
  LucideAngularModule,
  X,
  ReceiptText,
  LoaderCircle,
  ChevronDown,
} from 'lucide-angular';
import { ClientFormModalComponent } from '../client-form-modal/client-form-modal';
import { finalize, switchMap, map } from 'rxjs';
import { ReceiptService } from '../../receipt.service';

@Component({
  standalone: true,
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.html',
  imports: [CommonModule, LucideAngularModule, ClientFormModalComponent],
})
export class InvoiceDialogComponent {
  private clientService = inject(ClientService);
  private invoiceService = inject(InvoiceService);
  private receiptService = inject(ReceiptService);

  readonly XIcon = X;
  readonly ReceiptText = ReceiptText;
  readonly ChevronDown = ChevronDown;
  readonly LoaderCircle = LoaderCircle;

  clients = signal<Client[]>([]);
  isClientFormVisible = signal(false);
  isGeneratingInvoice = signal(false);
  selectedClientId = signal<string | null>(null);

  receipt = input.required<Receipt>();
  token = input.required<string>();

  close = output<void>();
  invoiceGenerated = output<string | null>();

  ngOnInit() {
    this.loadClients();
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

  onGenerateInvoice() {
    const receipt = this.receipt();
    const clientId = this.selectedClientId();
    if (receipt && clientId) {
      this.isGeneratingInvoice.set(true);
      this.invoiceService
        .createInvoice(receipt, clientId, this.token())
        .pipe(
          switchMap((createdInvoiceId: string | null) =>
            this.receiptService
              .updateReceipt(receipt, this.token(), 'billed')
              .pipe(map(() => createdInvoiceId))
          ),
          finalize(() => {
            this.isGeneratingInvoice.set(false);
            this.onClose();
          })
        )
        .subscribe({
          next: (createdInvoiceId: string | null) => {
            this.invoiceGenerated.emit(createdInvoiceId ?? null);
          },
          error: (error) => {
            console.error('Error generating invoice:', error);
          },
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
