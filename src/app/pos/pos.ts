import {
  Component,
  type OnInit,
  inject,
  computed,
  signal,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MealService, type Meal } from '../meal.service';
import { CartItem, Receipt, UserAccount, Table } from '../types/pos.types';
import { ReceiptService } from '../receipt.service';

// Import all child components
import { LoginComponent } from '../components/login/login';
import { CategoryNavComponent } from '../components/category-nav/category-nav';
import { MenuGridComponent } from '../components/menu-grid/menu-grid';
import { CartComponent } from '../components/cart/cart';

import { AllReceiptsModalComponent } from '../components/all-receipts-modal/all-receipts-modal';
import { CalculatorComponent } from '../components/calculator/calculator';

@Component({
  standalone: true,
  selector: 'app-pos',
  templateUrl: './pos.html',
  imports: [
    CommonModule,
    LoginComponent,
    CategoryNavComponent,
    MenuGridComponent,
    CartComponent,
    CalculatorComponent,
    AllReceiptsModalComponent,
  ],
})
export class PosComponent implements OnInit {
  private mealService = inject(MealService);
  private receiptService = inject(ReceiptService);
  private elementRef = inject(ElementRef);

  // Authentication state
  isLoggedIn = signal<boolean>(false);
  currentUser = signal<UserAccount | null>(null);

  // Maximum meals to display
  private readonly MAX_MEALS = 24;

  // Category images mapping with actual food images
  private categoryImages: { [key: string]: string } = {
    Beef: 'https://images.unsplash.com/photo-1690983330536-3b0089d07cf9?w=100&h=100&fit=crop&crop=center',
    Chicken:
      'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=100&h=100&fit=crop&crop=center',
    Dessert:
      'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=100&h=100&fit=crop&crop=center',
    Lamb: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop&crop=center',
    Miscellaneous:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop&crop=center',
    Pasta:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=100&h=100&fit=crop&crop=center',
    Pork: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=100&h=100&fit=crop&crop=center',
    Seafood:
      'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=100&h=100&fit=crop&crop=center',
    Side: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop&crop=center',
    Starter:
      'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=100&h=100&fit=crop&crop=center',
    Vegan:
      'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=100&h=100&fit=crop&crop=center',
    Vegetarian:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop&crop=center',
    Breakfast:
      'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=100&h=100&fit=crop&crop=center',
    Goat: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=100&h=100&fit=crop&crop=center',
  };

  // Order type and table management signals
  orderType = signal<'take away' | 'table'>('table');
  tableNumber = signal<string>('');
  isTableNumberComplete = signal<boolean>(false);
  tables = signal<Table[]>(
    Array.from({ length: 12 }, (_, i) => ({
      name: `T${i + 1}`,
      occupied: false,
      userId: null,
    }))
  );

  // Receipt management
  showReceipt = signal<boolean>(false);
  currentReceipt = signal<Receipt | null>(null);
  showAllReceipts = signal<boolean>(false);

  // Signals
  meals = signal<Meal[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('All');
  cart = signal<CartItem[]>([]);
  loading = signal<boolean>(false);
  selectedCartItemId = signal<string | null>(null);
  tempQuantity = signal<string>('');
  tableErrorMessage = signal<string | null>(null);

  // Order counter for receipt numbers
  private orderCounter = 1;

  isEditing = signal(false);
  lastOrderContext = signal<
    'take away' | 'occupied_table' | 'unoccupied_table' | null
  >(null);

  // Computed properties
  categoriesWithImages = computed(() => {
    return this.categories()
      .slice(0, 12)
      .map((category) => ({
        name: category,
        image:
          this.categoryImages[category] ||
          'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop&crop=center',
      }));
  });

  total = computed(() => {
    return this.cart().reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  });

  canAddToCart = computed(() => {
    return Boolean(
      this.orderType() === 'take away' ||
        (this.orderType() === 'table' && this.isTableNumberComplete())
    );
  });

  calculatorDisplayValue = computed(() => {
    if (this.selectedCartItemId()) return this.tempQuantity() || '0';
    if (this.orderType() === 'table' && !this.isTableNumberComplete())
      return this.tableNumber() || '0';
    return '0';
  });
  calculatorIsQuantityMode = computed(() => {
    return Boolean(this.selectedCartItemId());
  });

  constructor() {
    this.isEditing.set(false);
  }

  ngOnInit() {
    // Don't load categories until user is logged in
    if (this.isLoggedIn()) {
      this.loadCategories();
    }
  }

  // Login event handler
  onLoginSuccess(user: UserAccount) {
    this.currentUser.set(user);
    this.isLoggedIn.set(true);
    this.loadCategories(); // Load data after successful login
    this.isEditing.set(true);
    this.syncTablesWithReceipts();
    this.lastOrderContext.set(null); // Initialize on login
  }

  // Logout method
  logout() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.clearCart(); // Clear cart on logout
    this.finishEditing(false); // Finish any editing
    this.isEditing.set(false);

    // Reset table state
    this.orderType.set('table');
    this.tableNumber.set('');
    this.isTableNumberComplete.set(false);
    this.tableErrorMessage.set(null);
  }

  // ... rest of your existing methods remain exactly the same ...

  // Global click handler to finish editing when clicking outside calculator
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Only handle clicks when editing quantity and logged in
    if (!this.selectedCartItemId() || !this.isLoggedIn()) return;

    const target = event.target as HTMLElement;
    const calculatorElement =
      this.elementRef.nativeElement.querySelector('app-calculator');

    // Check if click is inside calculator
    if (calculatorElement && calculatorElement.contains(target)) {
      return; // Don't finish editing if clicking inside calculator
    }

    // Check if click is on a quantity button (to allow switching between items)
    const quantityButton = target.closest('[data-edit-button]');
    if (quantityButton) {
      return; // Don't finish editing if clicking on quantity button
    }

    // Finish editing for any other click
    this.finishEditing(true);
  }

  // Event handlers for child components
  onCategorySelected(category: string) {
    this.finishEditing(true); // Finish editing when changing category
    this.selectedCategory.set(category);
    this.loadMeals();
  }

  onMealSelected(meal: Meal) {
    this.finishEditing(true); // Finish editing when adding new item
    this.addToCart(meal);
  }

  onCartItemSelected(itemId: string) {
    // Don't finish editing here, allow switching between items
    this.selectCartItemForQuantity(itemId);
    this.isEditing.set(true);
  }

  onCartItemRemoved(itemId: string) {
    // If removing the item being edited, finish editing
    if (this.selectedCartItemId() === itemId) {
      this.finishEditing(false);
    }
    this.removeFromCart(itemId);
  }

  onQuantityIncreased(itemId: string) {
    this.finishEditing(true); // Finish editing when using +/- buttons
    this.increaseQuantity(itemId);
  }

  onQuantityDecreased(itemId: string) {
    this.finishEditing(true); // Finish editing when using +/- buttons
    this.decreaseQuantity(itemId);
  }

  onCartCleared() {
    this.finishEditing(false); // Finish editing when clearing cart
    this.clearCart();
  }

  onOrderCompleted() {
    this.finishEditing(false); // Finish editing when completing order
    this.completeOrder();
  }

  onTakeAwaySelected() {
    // If already on a take away order with items, prevent starting a new one
    if (this.orderType() === 'take away' && this.cart().length > 0) {
      alert('Please complete the current take away order first.');
      return;
    }
    this.finishEditing(false); // Finish editing when changing service type
    this.selectTakeAway();
    this.isEditing.set(false);
    this.clearCart();
  }

  onTableTypeSelected() {
    this.finishEditing(false); // Finish editing when changing service type
    this.orderType.set('table');
    this.tableNumber.set('');
    this.isTableNumberComplete.set(false);
    this.tableErrorMessage.set(null);
    this.isEditing.set(true);
  }

  onCalculatorNumberAdded(num: string) {
    this.addNumber(num);
    this.isEditing.set(true);
  }

  onCalculatorDecimalAdded() {
    this.addDecimal();
    this.isEditing.set(true);
  }

  onCalculatorCleared() {
    this.clearNumber();
    this.isEditing.set(true);
  }

  onCalculatorConfirmed() {
    if (this.isEditing()) {
      this.confirmNumber();
    }
  }

  calculatorCanConfirm = computed(() => {
    return this.isEditing();
  });

  // Method to finish editing
  private finishEditing(applyChanges: boolean) {
    if (this.selectedCartItemId()) {
      if (applyChanges) {
        this.autoApplyQuantityChange();
      }
      this.selectedCartItemId.set(null);
      this.tempQuantity.set('');
    }
    this.isEditing.set(false);
  }

  // ... rest of all your existing methods remain exactly the same ...
  // (loadCategories, loadMeals, addToCart, etc.)

  // Core business logic methods
  private loadCategories() {
    this.mealService.getCategories().subscribe((data) => {
      const categoryList = data.categories.map((cat: any) => cat.strCategory);
      this.categories.set(categoryList);
      if (categoryList.length > 0) {
        this.selectedCategory.set(categoryList[0]);
      }
      this.loadMeals();
    });
  }

  private loadMeals() {
    this.loading.set(true);
    this.mealService
      .getMealsByCategory(this.selectedCategory())
      .subscribe((data) => {
        const mealsWithPrices = (data.meals || [])
          .slice(0, this.MAX_MEALS)
          .map((meal: any) => ({
            ...meal,
            price: Math.floor(Math.random() * 25) + 8,
          }));

        this.meals.set(mealsWithPrices);
        this.loading.set(false);
      });
  }

  private addToCart(meal: Meal) {
    if (!this.canAddToCart()) {
      if (this.orderType() === 'table') {
        alert('Please enter and confirm table number first!');
      }
      return;
    }

    const currentCart = this.cart();
    const existingItemIndex = currentCart.findIndex(
      (item) => item.idMeal === meal.idMeal
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity++;
      this.cart.set(updatedCart);
    } else {
      this.cart.set([...currentCart, { ...meal, quantity: 1 }]);
    }
  }

  private selectCartItemForQuantity(itemId: string) {
    const item = this.cart().find((item) => item.idMeal === itemId);
    if (item) {
      this.selectedCartItemId.set(itemId);
      this.tempQuantity.set(''); // Clear previous quantity
    }
  }

  private removeFromCart(id: string) {
    const currentCart = this.cart();
    const filteredCart = currentCart.filter((item) => item.idMeal !== id);
    this.cart.set(filteredCart);
  }

  private increaseQuantity(id: string) {
    const currentCart = this.cart();
    const itemIndex = currentCart.findIndex((item) => item.idMeal === id);

    if (itemIndex !== -1) {
      const updatedCart = [...currentCart];
      const currentQuantity = updatedCart[itemIndex].quantity;
      let newQuantity: number;

      if (currentQuantity === 0.5) {
        newQuantity = currentQuantity + 0.5;
      } else {
        newQuantity = currentQuantity + 1;
      }

      newQuantity = Math.min(100, newQuantity);
      updatedCart[itemIndex].quantity = Math.round(newQuantity * 100) / 100;
      this.cart.set(updatedCart);
    }
  }

  private decreaseQuantity(id: string) {
    const currentCart = this.cart();
    const itemIndex = currentCart.findIndex((item) => item.idMeal === id);

    if (itemIndex !== -1) {
      const updatedCart = [...currentCart];
      const currentQuantity = updatedCart[itemIndex].quantity;

      if (currentQuantity <= 0.5) {
        // If current quantity is already at or below the minimum, remove the item
        this.removeFromCart(id);
      } else {
        // Otherwise, decrease quantity, ensuring it doesn't go below 0.1
        const newQuantity = Math.max(0.5, currentQuantity - 1);
        updatedCart[itemIndex].quantity = Math.round(newQuantity * 10) / 10;
        this.cart.set(updatedCart);
      }
    }
  }

  private clearCart() {
    this.cart.set([]);
  }

  private selectTakeAway() {
    this.orderType.set('take away');
    this.tableNumber.set('');
    this.isTableNumberComplete.set(false);
  }

  private addNumber(num: string) {
    if (this.selectedCartItemId()) {
      const currentQuantity = this.tempQuantity();
      if (currentQuantity.length < 5) {
        this.tempQuantity.set(currentQuantity + num);
      }
    } else if (this.orderType() === 'table') {
      const currentNumber = this.tableNumber();
      if (currentNumber.length < 3) {
        this.tableNumber.set(currentNumber + num);
      }
    }
  }

  private addDecimal() {
    if (this.selectedCartItemId()) {
      const currentQuantity = this.tempQuantity();
      if (!currentQuantity.includes('.') && currentQuantity.length > 0) {
        this.tempQuantity.set(currentQuantity + '.');
      }
    }
  }

  private clearNumber() {
    if (this.selectedCartItemId()) {
      this.tempQuantity.set('');
      this.resetToOriginalQuantity();
    } else if (this.orderType() === 'table') {
      this.tableNumber.set('');
      this.isTableNumberComplete.set(false);
    }
  }

  private confirmNumber() {
    this.tableErrorMessage.set(null); // Clear previous error messages
    if (this.tableNumber() && this.orderType() === 'table') {
      const tableName = 'T' + this.tableNumber();
      const table = this.tables().find((t) => t.name === tableName);

      if (!table) {
        this.isTableNumberComplete.set(false);
        this.tableErrorMessage.set('Invalid table number.');
        return;
      }

      // Capture the occupied status of the table *before* the new confirmation
      const previousTableName =
        this.orderType() === 'table' && this.isTableNumberComplete()
          ? 'T' + this.tableNumber()
          : null;
      const previousTable = previousTableName
        ? this.tables().find((t) => t.name === previousTableName)
        : null;
      const previousTableWasOccupied = previousTable?.occupied || false;

      if (table.occupied) {
        if (table.userId !== this.currentUser()!.userId) {
          this.isTableNumberComplete.set(false);
          this.tableErrorMessage.set('This table is served by another server.');
          return;
        }
        const receipt = this.receiptService.getReceiptByTable(tableName);
        if (receipt) {
          this.cart.set([...receipt.items]);
          this.isTableNumberComplete.set(true);
          this.orderType.set('table');
        } else {
          this.isTableNumberComplete.set(true);
        }
      } else {
        // Table is NOT occupied
        // Clear cart ONLY if switching from an occupied table to an unoccupied one, and cart is not empty
        if (previousTableWasOccupied && this.cart().length > 0) {
          this.clearCart();
        }
        this.isTableNumberComplete.set(true);
      }
    }
    this.isEditing.set(false);
  }

  private autoApplyQuantityChange() {
    if (this.selectedCartItemId() && this.tempQuantity()) {
      const quantity = parseFloat(this.tempQuantity());
      if (!isNaN(quantity) && quantity > 0) {
        const validQuantity = Math.max(0.1, Math.min(100, quantity));
        this.updateQuantity(this.selectedCartItemId()!, validQuantity);
      }
    }
  }

  private resetToOriginalQuantity() {
    if (this.selectedCartItemId()) {
      const item = this.cart().find(
        (item) => item.idMeal === this.selectedCartItemId()
      );
      if (item) {
        this.updateQuantity(this.selectedCartItemId()!, item.quantity);
      }
    }
  }

  private updateQuantity(id: string, newQuantity: number) {
    const currentCart = this.cart();
    const itemIndex = currentCart.findIndex((item) => item.idMeal === id);

    if (itemIndex !== -1) {
      const updatedCart = [...currentCart];
      const validQuantity = Math.max(0.1, Math.min(100, newQuantity));
      updatedCart[itemIndex].quantity = Math.round(validQuantity * 10) / 10;
      this.cart.set(updatedCart);
    }
  }

  private generateOrderNumber(): string {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const orderNum = this.orderCounter.toString().padStart(3, '0');
    this.orderCounter++;
    return `${dateStr}-${orderNum}`;
  }

  private completeOrder() {
    if (!this.canAddToCart() || this.cart().length === 0) {
      return;
    }

    const total = this.total();
    const tableName =
      this.orderType() === 'take away' ? 'Take away' : 'T' + this.tableNumber();

    // Always create a new receipt for 'take away' orders.
    // For 'table' orders, check for an existing receipt to update.
    if (this.orderType() === 'take away') {
      const receipt: Receipt = {
        orderNumber: this.generateOrderNumber(),
        tableName: tableName,
        items: [...this.cart()],
        total: total,
        date: new Date(),
        paymentMethod: 'Cash',
        userId: this.currentUser()!.userId,
      };
      this.receiptService.saveReceipt(receipt);
    } else {
      // 'table' order
      const existingReceipt = this.receiptService.getReceiptByTable(tableName);

      if (existingReceipt) {
        // Update existing receipt for table orders
        existingReceipt.items = [...this.cart()];
        existingReceipt.total = total;
        this.receiptService.updateReceipt(existingReceipt);
      } else {
        // Create a new receipt for table orders if none exists
        const receipt: Receipt = {
          orderNumber: this.generateOrderNumber(),
          tableName: tableName,
          items: [...this.cart()],
          total: total,
          date: new Date(),
          paymentMethod: 'Cash',
          userId: this.currentUser()!.userId,
        };
        this.receiptService.saveReceipt(receipt);
      }
    }

    // Reset currentReceipt after completing the order
    this.currentReceipt.set(null);

    if (this.orderType() === 'table') {
      const tables = this.tables().map((t) =>
        t.name === tableName
          ? { ...t, occupied: true, userId: this.currentUser()!.userId }
          : t
      );
      this.tables.set(tables);
    }

    this.clearCart();

    if (this.orderType() === 'take away') {
      this.orderType.set('table');
      this.isEditing.set(true);
    } else {
      this.orderType.set('table');
      this.tableNumber.set('');
      this.isTableNumberComplete.set(false);
      this.tableErrorMessage.set(null);
      this.isEditing.set(true);
    }
  }

  private syncTablesWithReceipts() {
    const allReceipts = this.receiptService.getAllReceipts();
    const occupiedTables = allReceipts.reduce((acc, receipt) => {
      if (receipt.tableName.startsWith('T')) {
        acc[receipt.tableName] = receipt.userId;
      }
      return acc;
    }, {} as { [key: string]: string });

    this.tables.set(
      this.tables().map((table) => ({
        ...table,
        occupied: !!occupiedTables[table.name],
        userId: occupiedTables[table.name] || null,
      }))
    );
  }

  pay(orderNumber: string) {
    this.onPayFromModal(orderNumber);
  }

  onPayFromModal(orderNumber: string) {
    const currentUser = this.currentUser();
    if (!currentUser) return;

    const receipt = this.receiptService
      .getReceipts(currentUser.userId)
      .find((r) => r.orderNumber === orderNumber);
    if (receipt) {
      const tables = this.tables().map((t) =>
        t.name === receipt.tableName
          ? { ...t, occupied: false, userId: null }
          : t
      );
      this.tables.set(tables);
      this.receiptService.deleteReceiptByOrderNumber(orderNumber);
      this.orderType.set('table');
      this.tableNumber.set('');
      this.isTableNumberComplete.set(false);
      this.tableErrorMessage.set(null);
      this.isEditing.set(true);
    }
  }

  showAllReceiptsModal() {
    this.showAllReceipts.set(true);
  }

  hideAllReceiptsModal() {
    this.showAllReceipts.set(false);
  }

  onReceiptSelectedFromModal(receipt: Receipt) {
    this.cart.set([...receipt.items]);
    this.orderType.set(
      receipt.tableName === 'Take away' ? 'take away' : 'table'
    );
    if (receipt.tableName.startsWith('T')) {
      this.tableNumber.set(receipt.tableName.replace('T', ''));
      this.isTableNumberComplete.set(true);
    } else {
      this.tableNumber.set('');
      this.isTableNumberComplete.set(false);
    }
    this.currentReceipt.set(receipt); // Set the current receipt
    this.hideAllReceiptsModal();
  }

  onPay() {
    if (!this.canAddToCart() || this.cart().length === 0) {
      if (this.orderType() === 'table' && !this.isTableNumberComplete()) {
        alert('Please enter and confirm table number first!');
      }
      return;
    }

    const total = this.total();
    const tableName =
      this.orderType() === 'take away' ? 'Take away' : 'T' + this.tableNumber();

    // Check if there is an existing receipt for this table
    const existingReceipt = this.receiptService.getReceiptByTable(tableName);

    if (existingReceipt) {
      // Update existing receipt and mark as paid
      existingReceipt.items = [...this.cart()];
      existingReceipt.total = total;
      existingReceipt.paymentMethod = 'Paid';
      this.receiptService.updateReceipt(existingReceipt);
      // Immediately delete the receipt as it's now paid and settled
      this.receiptService.deleteReceiptByOrderNumber(
        existingReceipt.orderNumber
      );
    } else {
      // Create a new receipt if none exists
      const receipt: Receipt = {
        orderNumber: this.generateOrderNumber(),
        tableName: tableName,
        items: [...this.cart()],
        total: total,
        date: new Date(),
        paymentMethod: 'Paid',
        userId: this.currentUser()!.userId,
      };
      this.receiptService.saveReceipt(receipt);
    }

    // Free up the table if it was a table order
    if (this.orderType() === 'table') {
      const tables = this.tables().map((t) =>
        t.name === tableName ? { ...t, occupied: false, userId: null } : t
      );
      this.tables.set(tables);
    }

    // Clear the cart and reset the UI for the next order
    this.clearCart();
    this.finishEditing(false);
    this.orderType.set('table');
    this.tableNumber.set('');
    this.isTableNumberComplete.set(false);
    this.tableErrorMessage.set(null);
    this.isEditing.set(true);
  }
}
