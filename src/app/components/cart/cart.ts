import { Component, input, output, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Armchair,
  Receipt,
  CreditCard,
  Replace,
  Printer,
} from 'lucide-angular';
import { CartItem, Table, Receipt as ReceiptType } from '../../types/pos.types';
import { ServiceSelectionComponent } from '../service-selection/service-selection';
import { ConfigurationService } from '../../configuration.service';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.html',
  imports: [CommonModule, LucideAngularModule, ServiceSelectionComponent],
})
export class CartComponent implements OnInit {
  readonly ShoppingCartIcon = ShoppingCart;
  readonly TrashIcon = Trash2;
  readonly PlusIcon = Plus;
  readonly MinusIcon = Minus;
  readonly ShoppingBagIcon = ShoppingBag;
  readonly Armchair = Armchair;
  readonly Receipt = Receipt;
  readonly CreditCard = CreditCard;
  readonly Replace = Replace;
  readonly Printer = Printer;

  private configurationService = inject(ConfigurationService);

  // Company info for PDF
  companyInfo = signal<any>(null);
  logoUrl = signal<string | null>(null);

  cartItems = input.required<CartItem[]>();
  selectedCartItemId = input<string | null>(null);
  tempQuantity = input<string>('');
  total = input.required<number>();
  canAddToCart = input.required<boolean>();
  orderType = input.required<'take away' | 'table'>();
  tableNumber = input.required<string>();
  tables = input.required<Table[]>();
  isTableOccupied = input.required<boolean>();
  userId = input.required<string>();

  itemSelected = output<string>();
  itemRemoved = output<string>();
  cartCleared = output<void>();
  orderCompleted = output<void>();
  quantityIncreased = output<string>();
  quantityDecreased = output<string>();
  takeAwaySelected = output<void>();
  tableTypeSelected = output<void>();
  pay = output<void>();
  transfer = output<void>();

  displayHeader = computed(() => {
    if (this.orderType() === 'table' && this.tableNumber()) {
      return `Table: ${this.tableNumber()}`;
    } else {
      return 'Cart Details';
    }
  });

  displayIcon = computed(() => {
    if (this.orderType() === 'table' && this.tableNumber()) {
      return this.Armchair;
    } else {
      return this.ShoppingCartIcon;
    }
  });

  ngOnInit() {
    this.loadCompanyInfo();
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

  onSelectItem(itemId: string) {
    this.itemSelected.emit(itemId);
  }

  onRemoveItem(itemId: string, event: Event) {
    event.stopPropagation();
    this.itemRemoved.emit(itemId);
  }

  onIncreaseQuantity(itemId: string, event: Event) {
    event.stopPropagation();
    this.quantityIncreased.emit(itemId);
  }

  onDecreaseQuantity(itemId: string, event: Event) {
    event.stopPropagation();
    this.quantityDecreased.emit(itemId);
  }

  onClearCart() {
    this.cartCleared.emit();
  }

  onCompleteOrder() {
    this.orderCompleted.emit();
  }

  onPay() {
    this.pay.emit();
  }

  onTransfer() {
    this.transfer.emit();
  }

  getDisplayQuantity(item: CartItem): number | string {
    return this.selectedCartItemId() === item.id
      ? this.tempQuantity() || item.quantity
      : item.quantity;
  }

  isItemBeingEdited(item: CartItem): boolean {
    return this.selectedCartItemId() === item.id;
  }

  print() {
    const receiptToPrint: ReceiptType = {
      id: '', // Not needed for printing from cart
      orderNumber: this.tableNumber() ? `Table ${this.tableNumber()}` : 'Take Away',
      date: new Date(),
      total: this.total(),
      items: this.cartItems(),
      responsable: '', // Not available in cart, can be left empty
      status: 'in_progress',
      tableName: this.tableNumber() ? `Table ${this.tableNumber()}` : 'Take Away',
      paymentMethod: '', // Not available in cart, can be empty
      userId: this.userId(),
      client: null, // Not available in cart
      orderDetails: null, // Not available in cart
    };
    this.generateReceiptPDF(receiptToPrint);
  }

  generateReceiptPDF(receipt: ReceiptType) {
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
}