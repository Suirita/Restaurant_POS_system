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
  totalReceipts = signal<number>(0);
  totalInvoices = signal<number>(0);
  totalInvoicesRevenue = signal<number>(0);

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    const token = JSON.parse(localStorage.getItem('user') || '{}').token;
    if (token) {
      this.userService.getUsers().subscribe((users) => {
        const userIds = users.map((user) => user.userId);
        this.receiptService
          .getAllReceipts(token, userIds, [
            'in_progress',
            'accepted',
            'late',
            'refused',
          ])
          .subscribe((receipts) => {
            this.calculateTotalRevenue(receipts);
            this.createSalesByCategoryChart(receipts);
            this.createSalesOverTimeChart(receipts);
          });
      });

      this.invoiceService.getAllInvoices(token).subscribe((invoices) => {
        this.calculateTotalInvoices(invoices.value);
      });
    }
  }

  calculateTotalRevenue(receipts: Receipt[]) {
    const filteredReceipts = receipts.filter(
      (receipt) => receipt.status !== 'billed'
    );
    const revenue = filteredReceipts.reduce(
      (sum, receipt) => sum + receipt.total,
      0
    );
    this.totalRevenue.set(revenue);
    this.totalReceipts.set(filteredReceipts.length);
  }

  calculateTotalInvoices(invoices: Invoice[]) {
    const revenue = invoices.reduce(
      (sum, invoice) => sum + (invoice.totalTTC || invoice.total),
      0
    );
    this.totalInvoicesRevenue.set(revenue);
    this.totalInvoices.set(invoices.length);
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
