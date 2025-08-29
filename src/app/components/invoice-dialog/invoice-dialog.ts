import { Component, output, inject, input, signal, computed } from '@angular/core';
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
import { finalize } from 'rxjs';
import {
  SearchableSelectComponent,
  Option,
} from '../searchable-select/searchable-select';

@Component({
  standalone: true,
  selector: 'app-invoice-dialog',
  templateUrl: './invoice-dialog.html',
  imports: [
    CommonModule,
    LucideAngularModule,
    ClientFormModalComponent,
    SearchableSelectComponent,
  ],
})
export class InvoiceDialogComponent {
  private clientService = inject(ClientService);
  private invoiceService = inject(InvoiceService);

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

  clientOptions = computed<Option[]>(() => {
    const clients = this.clients();
    const options: Option[] = clients.map((client) => ({
      value: client.id,
      label: client.name,
    }));
    options.unshift({ value: 'new', label: 'Créer un nouveau client' });
    return options;
  });

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

  onClientSelectionChange(value: string) {
    if (value === 'new') {
      this.isClientFormVisible.set(true);
      setTimeout(() => this.selectedClientId.set(null), 0);
    } else {
      this.selectedClientId.set(value);
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