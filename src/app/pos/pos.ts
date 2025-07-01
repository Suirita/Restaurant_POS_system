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
import {
  CartItem,
  Receipt,
  UserAccount,
} from '../types/pos.types';

// Import all child components
import { LoginComponent } from '../components/login/login';
import { ReceiptModalComponent } from '../components/receipt-modal/receipt-modal';
import { CategoryNavComponent } from '../components/category-nav/category-nav';
import { MenuGridComponent } from '../components/menu-grid/menu-grid';
import { CartComponent } from '../components/cart/cart';
import { ServiceSelectionComponent } from '../components/service-selection/service-selection';
import { CalculatorComponent } from '../components/calculator/calculator';

@Component({
  standalone: true,
  selector: 'app-pos',
  templateUrl: './pos.html',
  imports: [
    CommonModule,
    LoginComponent,
    ReceiptModalComponent,
    CategoryNavComponent,
    MenuGridComponent,
    CartComponent,
    ServiceSelectionComponent,
    CalculatorComponent,
  ],
})
export class PosComponent implements OnInit {
  private mealService = inject(MealService);
  private elementRef = inject(ElementRef);

  // Authentication state
  isLoggedIn = signal<boolean>(false);
  currentUser = signal<UserAccount | null>(null);

  // ... rest of your existing properties remain the same ...

  // Maximum meals to display
  private readonly MAX_MEALS = 15;

  // Category images mapping with actual food images
  private categoryImages: { [key: string]: string } = {
    All: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop&crop=center',
    Beef: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=100&h=100&fit=crop&crop=center',
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
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop&crop=center',
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

  // Receipt management
  showReceipt = signal<boolean>(false);
  currentReceipt = signal<Receipt | null>(null);

  // Signals
  meals = signal<Meal[]>([]);
  categories = signal<string[]>([]);
  selectedCategory = signal<string>('All');
  cart = signal<CartItem[]>([]);
  loading = signal<boolean>(false);
  selectedCartItemId = signal<string | null>(null);
  tempQuantity = signal<string>('');

  // Order counter for receipt numbers
  private orderCounter = 1;

  // Responsive design signals
  isResizing = signal(false);
  menuHeight = signal(60);
  isMobile = signal(false);

  // ... all your existing computed properties remain the same ...

  // Computed properties
  categoriesWithImages = computed(() => {
    return this.categories()
      .slice(0, 9)
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

  calculatorLabel = computed(() => {
    if (this.selectedCartItemId()) return 'Quantity';
    if (this.orderType() === 'table' && !this.isTableNumberComplete())
      return 'Table';
    return 'Ready';
  });

  calculatorDisplayValue = computed(() => {
    if (this.selectedCartItemId()) return this.tempQuantity() || '0';
    if (this.orderType() === 'table' && !this.isTableNumberComplete())
      return this.tableNumber() || '0';
    return '0';
  });

  calculatorCanConfirm = computed(() => {
    // Only require confirmation for table mode
    if (this.selectedCartItemId()) return Boolean(this.tempQuantity());
    return Boolean(this.orderType() === 'table' && this.tableNumber());
  });

  calculatorIsQuantityMode = computed(() => {
    return Boolean(this.selectedCartItemId());
  });

  cartHeight = computed(() => 100 - this.menuHeight());

  constructor() {
    this.checkMobile();
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
  }

  // Logout method
  logout() {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.clearCart(); // Clear cart on logout
    this.finishEditing(); // Finish any editing
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
    this.finishEditing();
  }

  // Event handlers for child components
  onCategorySelected(category: string) {
    this.finishEditing(); // Finish editing when changing category
    this.selectedCategory.set(category);
    this.loadMeals();
  }

  onMealSelected(meal: Meal) {
    this.finishEditing(); // Finish editing when adding new item
    this.addToCart(meal);
  }

  onCartItemSelected(itemId: string) {
    // Don't finish editing here, allow switching between items
    this.selectCartItemForQuantity(itemId);
  }

  onCartItemRemoved(itemId: string) {
    // If removing the item being edited, finish editing
    if (this.selectedCartItemId() === itemId) {
      this.finishEditing();
    }
    this.removeFromCart(itemId);
  }

  onQuantityIncreased(itemId: string) {
    this.finishEditing(); // Finish editing when using +/- buttons
    this.increaseQuantity(itemId);
  }

  onQuantityDecreased(itemId: string) {
    this.finishEditing(); // Finish editing when using +/- buttons
    this.decreaseQuantity(itemId);
  }

  onCartCleared() {
    this.finishEditing(); // Finish editing when clearing cart
    this.clearCart();
  }

  onOrderCompleted() {
    this.finishEditing(); // Finish editing when completing order
    this.completeOrder();
  }

  onTakeAwaySelected() {
    this.finishEditing(); // Finish editing when changing service type
    this.selectTakeAway();
  }

  onTableSelected() {
    this.finishEditing(); // Finish editing when changing service type
    this.selectTable();
  }

  onCalculatorNumberAdded(num: string) {
    this.addNumber(num);

    // Auto-apply quantity changes immediately
    if (this.selectedCartItemId() && this.tempQuantity()) {
      this.autoApplyQuantityChange();
    }
  }

  onCalculatorDecimalAdded() {
    this.addDecimal();
  }

  onCalculatorCleared() {
    this.clearNumber();
  }

  onCalculatorConfirmed() {
    // Only confirm for table mode
    if (!this.selectedCartItemId()) {
      this.confirmNumber();
    }
  }

  onReceiptClosed() {
    this.finishEditing(); // Finish editing when closing receipt
    this.closeReceipt();
  }

  onReceiptPrinted() {
    this.printReceipt();
  }

  // Method to finish editing
  private finishEditing() {
    if (this.selectedCartItemId()) {
      this.selectedCartItemId.set(null);
      this.tempQuantity.set('');
    }
  }

  // ... rest of all your existing methods remain exactly the same ...
  // (loadCategories, loadMeals, addToCart, etc.)

  // Core business logic methods
  private loadCategories() {
    this.mealService.getCategories().subscribe((data) => {
      const categoryList = [
        'All',
        ...data.categories.map((cat: any) => cat.strCategory),
      ];
      this.categories.set(categoryList);
      this.loadMeals();
    });
  }

  private loadMeals() {
    this.loading.set(true);
    if (this.selectedCategory() === 'All') {
      this.loadMealsFromMultipleCategories();
    } else {
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
  }

  private loadMealsFromMultipleCategories() {
    this.mealService.getMealsByCategory('Beef').subscribe((data) => {
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
      this.tempQuantity.set(item.quantity.toString());
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
      const newQuantity = Math.min(99.99, updatedCart[itemIndex].quantity + 1);
      updatedCart[itemIndex].quantity = Math.round(newQuantity * 100) / 100;
      this.cart.set(updatedCart);
    }
  }

  private decreaseQuantity(id: string) {
    const currentCart = this.cart();
    const itemIndex = currentCart.findIndex((item) => item.idMeal === id);

    if (itemIndex !== -1) {
      const updatedCart = [...currentCart];
      const newQuantity = Math.max(0.1, updatedCart[itemIndex].quantity - 1);
      updatedCart[itemIndex].quantity = Math.round(newQuantity * 100) / 100;
      this.cart.set(updatedCart);
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

  private selectTable() {
    this.orderType.set('table');
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
    if (this.tableNumber() && this.orderType() === 'table') {
      this.isTableNumberComplete.set(true);
    }
  }

  private autoApplyQuantityChange() {
    if (this.selectedCartItemId() && this.tempQuantity()) {
      const quantity = parseFloat(this.tempQuantity());
      if (!isNaN(quantity) && quantity > 0) {
        const validQuantity = Math.max(0.1, Math.min(99.99, quantity));
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
      const validQuantity = Math.max(0.1, Math.min(99.99, newQuantity));
      updatedCart[itemIndex].quantity = Math.round(validQuantity * 100) / 100;
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
    const serviceName =
      this.orderType() === 'take away'
        ? 'Take away'
        : `Table ${this.tableNumber()}`;

    const receipt: Receipt = {
      orderNumber: this.generateOrderNumber(),
      tableName: serviceName,
      items: [...this.cart()],
      total: total,
      date: new Date(),
      paymentMethod: 'Cash',
    };

    this.currentReceipt.set(receipt);
    this.showReceipt.set(true);
  }

  private closeReceipt() {
    this.showReceipt.set(false);
    this.currentReceipt.set(null);
    this.clearCart();
    this.selectTakeAway();
  }

  private printReceipt() {
    window.print();
  }

  // Responsive design methods
  @HostListener('window:resize')
  onWindowResize() {
    this.checkMobile();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing() && this.isMobile()) {
      this.handleResize(event.clientY);
    }
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isResizing() && this.isMobile()) {
      event.preventDefault();
      const touch = event.touches[0];
      this.handleResize(touch.clientY);
    }
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  onResizeEnd() {
    this.isResizing.set(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }

  checkMobile() {
    this.isMobile.set(window.innerWidth < 1024);
  }

  startResize(event: MouseEvent | TouchEvent) {
    if (!this.isMobile()) return;

    event.preventDefault();
    this.isResizing.set(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'row-resize';
  }

  handleResize(clientY: number) {
    const container = document.querySelector('.h-screen');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const relativeY = clientY - containerRect.top;
    const percentage = (relativeY / containerRect.height) * 100;

    const constrainedPercentage = Math.min(Math.max(percentage, 20), 80);
    this.menuHeight.set(constrainedPercentage);
  }
}
