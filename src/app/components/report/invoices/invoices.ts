import {
    Component,
    inject,
    signal,
    computed,
  } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { Invoice, CartItem } from '../../../types/pos.types';
  import { InvoiceService } from '../../../invoice.service';
  import { LoginService } from '../../../login.service';
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
  import { InvoiceDetailsModalComponent } from '../../invoice-details-modal/invoice-details-modal';
  import { UserAccount } from '../../../types/pos.types';
  
  @Component({
    standalone: true,
    selector: 'app-invoices',
    templateUrl: './invoices.html',
    imports: [CommonModule, LucideAngularModule, InvoiceDetailsModalComponent],
  })
  export class InvoicesComponent {
    readonly ReceiptText = ReceiptText;
    readonly XIcon = X;
    readonly Loader = LoaderCircle;
    readonly Clock = Clock;
    readonly User = User;
    readonly MessageCircle = MessageCircle;
    readonly Phone = Phone;
  
    private invoiceService = inject(InvoiceService);
    private loginService = inject(LoginService);
    invoices = signal<Invoice[]>([]);
    isLoading = signal<boolean>(false);
    
    private user: UserAccount | null = null;
  
    isInvoiceDetailsVisible = signal(false);
    selectedInvoice = signal<Invoice | null>(null);
  
    // Pagination
    currentPage = signal<number>(1);
    paginatedInvoices = computed(() => {
      const startIndex = (this.currentPage() - 1) * 9;
      const endIndex = startIndex + 9;
      return this.invoices().slice(startIndex, endIndex);
    });
  
    constructor() {
        const userString = localStorage.getItem('user');
        if (userString) {
          this.user = JSON.parse(userString);
        }
    }
  
    ngOnInit() {
      this.loadInvoices();
    }
  
    loadInvoices() {
      if (!this.user || !this.user.token) return;
      this.isLoading.set(true);
      this.invoiceService
        .getAllInvoices(this.user.token)
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
  
    onInvoiceClick(invoice: Invoice) {
        if (!this.user || !this.user.token) return;
      if (invoice.id) {
        this.invoiceService
          .getInvoiceDetails(invoice.id, this.user.token)
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
      // Implement your WhatsApp logic here
      console.log('Sending invoice via WhatsApp:', invoice);
    }
  }