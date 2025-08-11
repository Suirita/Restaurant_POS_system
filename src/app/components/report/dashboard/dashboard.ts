import { Component, OnInit, inject, signal } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReceiptService } from '../../../receipt.service';
import { InvoiceService } from '../../../invoice.service';
import { MealService } from '../../../meal.service';
import { UserService } from '../../../user.service';
import { Receipt, Invoice, Meal, UserAccount } from '../../../types/pos.types';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  private receiptService = inject(ReceiptService);
  private invoiceService = inject(InvoiceService);
  private mealService = inject(MealService);
  private userService = inject(UserService);

  totalRevenue = signal<number>(0);
  totalInvoices = signal<number>(0);
  topSellingMeal = signal<string>('');
  busiestUser = signal<string>('');

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    const token = JSON.parse(localStorage.getItem('user') || '{}').token;
    if (token) {
      this.receiptService.getAllReceipts(token).subscribe((receipts) => {
        this.calculateTotalRevenue(receipts);
        this.createSalesByCategoryChart(receipts);
        this.createSalesOverTimeChart(receipts);
      });

      this.invoiceService.getAllInvoices(token).subscribe((invoices) => {
        this.calculateTotalInvoices(invoices.value);
      });

      this.mealService.getMeals(token).subscribe((meals) => {
        this.receiptService.getAllReceipts(token).subscribe((receipts) => {
          this.calculateTopSellingMeal(receipts, meals);
        });
      });

      this.userService.getUsers().subscribe((users) => {
        this.receiptService.getAllReceipts(token).subscribe((receipts) => {
          this.calculateBusiestUser(receipts, users);
        });
      });
    }
  }

  calculateTotalRevenue(receipts: Receipt[]) {
    const revenue = receipts.reduce((sum, receipt) => sum + receipt.total, 0);
    this.totalRevenue.set(revenue);
  }

  calculateTotalInvoices(invoices: Invoice[]) {
    this.totalInvoices.set(invoices.length);
  }

  calculateTopSellingMeal(receipts: Receipt[], meals: Meal[]) {
    const mealCounts = new Map<string, number>();
    receipts.forEach((receipt) => {
      receipt.items.forEach((item) => {
        mealCounts.set(item.id, (mealCounts.get(item.id) || 0) + item.quantity);
      });
    });

    const topMealId = [...mealCounts.entries()].reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];
    const topMeal = meals.find((meal) => meal.id === topMealId);
    this.topSellingMeal.set(topMeal ? topMeal.designation : 'N/A');
  }

  calculateBusiestUser(receipts: Receipt[], users: UserAccount[]) {
    const userCounts = new Map<string, number>();
    receipts.forEach((receipt) => {
      userCounts.set(receipt.userId, (userCounts.get(receipt.userId) || 0) + 1);
    });

    const busiestUserId = [...userCounts.entries()].reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];
    const busiestUser = users.find((user) => user.userId === busiestUserId);
    this.busiestUser.set(busiestUser ? busiestUser.username : 'N/A');
  }

  createSalesByCategoryChart(receipts: Receipt[]) {
    const categorySales = new Map<string, number>();
    receipts.forEach((receipt) => {
      receipt.items.forEach((item) => {
        categorySales.set(
          item.categoryLabel,
          (categorySales.get(item.categoryLabel) || 0) +
            item.sellingPrice * item.quantity
        );
      });
    });

    new Chart('salesByCategoryChart', {
      type: 'doughnut',
      data: {
        labels: [...categorySales.keys()],
        datasets: [
          {
            label: 'Sales by Category',
            data: [...categorySales.values()],
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
            ],
          },
        ],
      },
    });
  }

  createSalesOverTimeChart(receipts: Receipt[]) {
    const salesByDate = new Map<string, number>();
    receipts.forEach((receipt) => {
      const date = new Date(receipt.date).toLocaleDateString();
      salesByDate.set(date, (salesByDate.get(date) || 0) + receipt.total);
    });

    new Chart('salesOverTimeChart', {
      type: 'line',
      data: {
        labels: [...salesByDate.keys()],
        datasets: [
          {
            label: 'Sales Over Time',
            data: [...salesByDate.values()],
            fill: false,
            borderColor: '#4BC0C0',
            tension: 0.1,
          },
        ],
      },
    });
  }
}
