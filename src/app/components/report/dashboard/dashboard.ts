import { Component, OnInit, inject, signal } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ReceiptService } from '../../../receipt.service';
import { InvoiceService } from '../../../invoice.service';
import { UserService } from '../../../user.service';
import { Receipt, Invoice } from '../../../types/pos.types';
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
  private userService = inject(UserService);

  totalRevenue = signal<number>(0);
  totalReceipts = signal<number>(0);
  totalInvoices = signal<number>(0);
  totalInvoicesRevenue = signal<number>(0);

  selectedPeriod = signal('this_month');
  startDate: Date | null = null;
  endDate: Date | null = null;

  private allReceipts: Receipt[] = [];
  private allInvoices: Invoice[] = [];

  private salesByCategoryChart?: Chart;
  private salesOverTimeChart?: Chart;

  ngOnInit() {
    this.setPeriod(this.selectedPeriod());
    this.fetchData();
  }

  fetchData() {
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
            this.allReceipts = receipts;
            this.invoiceService.getAllInvoices(token).subscribe((invoices) => {
              this.allInvoices = invoices.value;
              this.processData();
            });
          });
      });
    }
  }

  processData() {
    const filteredReceipts = this.filterReceiptsByDate(this.allReceipts);
    this.calculateTotalRevenue(filteredReceipts);
    this.updateSalesByCategoryChart(filteredReceipts);
    this.updateSalesOverTimeChart(filteredReceipts);

    const filteredInvoices = this.filterInvoicesByDate(this.allInvoices);
    this.calculateTotalInvoices(filteredInvoices);
  }

  setPeriod(period: string) {
    this.selectedPeriod.set(period);
    const now = new Date();
    switch (period) {
      case 'today':
        this.startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0,
          0
        );
        this.endDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999
        );
        break;
      case 'this_week':
        const currentDay = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const firstDay =
          now.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Adjust for Sunday
        this.startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          firstDay,
          0,
          0,
          0,
          0
        );
        this.endDate = new Date(
          this.startDate.getFullYear(),
          this.startDate.getMonth(),
          this.startDate.getDate() + 6,
          23,
          59,
          59,
          999
        );
        break;
      case 'this_month':
        this.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        this.endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        break;
      case 'this_quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        this.startDate = new Date(now.getFullYear(), quarter * 3, 1);
        this.endDate = new Date(
          now.getFullYear(),
          quarter * 3 + 3,
          0,
          23,
          59,
          59,
          999
        );
        break;
      case 'this_year':
        this.startDate = new Date(now.getFullYear(), 0, 1);
        this.endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
      case 'all':
        this.startDate = null;
        this.endDate = null;
        break;
      case 'custom':
        this.startDate = null;
        this.endDate = null;
        break;
    }
  }

  onPeriodChange(period: string) {
    this.setPeriod(period);
    if (period !== 'custom') {
      this.processData();
    }
  }

  onDateChange(dateValue: string, type: 'start' | 'end') {
    if (!dateValue) return;
    const date = new Date(dateValue);
    if (type === 'start') {
      this.startDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
        0
      );
    } else {
      this.endDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999
      );
    }

    if (this.startDate && this.endDate && this.startDate <= this.endDate) {
      this.processData();
    }
  }

  filterReceiptsByDate(receipts: Receipt[]): Receipt[] {
    if (!this.startDate || !this.endDate) {
      return receipts;
    }
    return receipts.filter((receipt) => {
      const receiptDate = new Date(receipt.date);
      return receiptDate >= this.startDate! && receiptDate <= this.endDate!;
    });
  }

  filterInvoicesByDate(invoices: Invoice[]): Invoice[] {
    if (!this.startDate || !this.endDate) {
      return invoices;
    }
    return invoices.filter((invoice: any) => {
      const invoiceDate = new Date(invoice.creationDate);
      return invoiceDate >= this.startDate! && invoiceDate <= this.endDate!;
    });
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

  updateSalesByCategoryChart(receipts: Receipt[]) {
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

    const chartData = {
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
    };

    if (this.salesByCategoryChart) {
      this.salesByCategoryChart.data = chartData;
      this.salesByCategoryChart.update();
    } else {
      this.salesByCategoryChart = new Chart('salesByCategoryChart', {
        type: 'doughnut',
        data: chartData,
      });
    }
  }

  updateSalesOverTimeChart(receipts: Receipt[]) {
    const salesByDate = new Map<string, number>();
    receipts.forEach((receipt) => {
      const date = new Date(receipt.date).toLocaleDateString('en-CA'); // YYYY-MM-DD for sorting
      salesByDate.set(date, (salesByDate.get(date) || 0) + receipt.total);
    });

    const sortedDates = [...salesByDate.keys()].sort();
    const chartLabels = sortedDates.map((date) =>
      new Date(date).toLocaleDateString()
    );
    const chartDataValues = sortedDates.map((date) => salesByDate.get(date)!);

    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          label: 'Sales Over Time',
          data: chartDataValues,
          fill: false,
          borderColor: '#4BC0C0',
          tension: 0.1,
        },
      ],
    };

    if (this.salesOverTimeChart) {
      this.salesOverTimeChart.data = chartData;
      this.salesOverTimeChart.update();
    } else {
      this.salesOverTimeChart = new Chart('salesOverTimeChart', {
        type: 'line',
        data: chartData,
      });
    }
  }
}
