import { Component, OnInit, inject, signal } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { forkJoin } from 'rxjs';
import { ReceiptService } from '../../../receipt.service';
import { InvoiceService } from '../../../invoice.service';
import { UserService } from '../../../user.service';
import { Receipt, Invoice } from '../../../types/pos.types';
import { CommonModule } from '@angular/common';
import {
  CustomSelectComponent,
  Option,
} from '../../custom-select/custom-select';
import { SearchableSelectComponent } from '../../searchable-select/searchable-select';
import {
  DateRangePickerComponent,
  DateRange,
} from '../../date-range-picker/date-range-picker';
import { LucideAngularModule, Download } from 'lucide-angular';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const centerTextPlugin = {
  id: 'centerText',
  afterDraw: (chart: any) => {
    const text = chart.options.plugins?.centerText?.text;
    if (chart.config.type !== 'doughnut' || !text) {
      return;
    }

    const {
      ctx,
      chartArea: { left, right, top, bottom },
    } = chart;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    ctx.save();
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, centerX, centerY);
    ctx.restore();
  },
};
Chart.register(...registerables, centerTextPlugin);

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    CustomSelectComponent,
    DateRangePickerComponent,
    LucideAngularModule,
    SearchableSelectComponent,
  ],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  readonly Download = Download;

  private receiptService = inject(ReceiptService);
  private invoiceService = inject(InvoiceService);
  private userService = inject(UserService);

  totalRevenue = signal<number>(0);
  totalReceipts = signal<number>(0);
  totalInvoices = signal<number>(0);
  totalInvoicesRevenue = signal<number>(0);

  selectedPeriod = signal('this_month');
  responsableFilter = signal<string>('all');
  responsableOptions = signal<Option[]>([]);
  startDate: Date | null = null;
  endDate: Date | null = null;
  dateRange: DateRange = {};

  periodOptions: Option[] = [
    { value: 'today', label: "Aujourd'hui" },
    { value: 'this_week', label: 'Cette Semaine' },
    { value: 'this_month', label: 'Ce Mois' },
    { value: 'this_quarter', label: 'Ce Trimestre' },
    { value: 'this_year', label: 'Cette Année' },
    { value: 'custom', label: 'Personnalisé' },
  ];

  private allReceipts: Receipt[] = [];
  private allInvoices: Invoice[] = [];

  private salesByCategoryChart?: Chart;
  private salesOverTimeChart?: Chart;

  ngOnInit() {
    this.setPeriod(this.selectedPeriod());
    this.loadResponsables();
    this.fetchData();
  }

  loadResponsables() {
    this.userService.getUsers().subscribe((users) => {
      const options = users.map(
        (user) => ({ value: user.userId, label: user.fullName } as Option)
      );
      this.responsableOptions.set([
        { value: 'all', label: 'Tous les responsables' },
        ...options,
      ]);
    });
  }

  fetchData() {
    const token = JSON.parse(localStorage.getItem('user') || '{}').token;
    if (!token) return;

    let dateStart: string | undefined;
    let dateEnd: string | undefined;

    if (this.startDate && this.endDate) {
      dateStart = `${this.startDate.getFullYear()}-${(
        this.startDate.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}-${this.startDate
        .getDate()
        .toString()
        .padStart(2, '0')}T00:00:00`;
      dateEnd = `${this.endDate.getFullYear()}-${(this.endDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${this.endDate
        .getDate()
        .toString()
        .padStart(2, '0')}T23:59:59`;
    }

    const techniciansToFilter =
      this.responsableFilter() === 'all' ? [] : [this.responsableFilter()];

    const body = {
      techniciansToFilter,
      dateStart,
      dateEnd,
    };
    console.log('Filtering with body:', body);

    const receiptsRequest = this.receiptService.getAllReceipts(
      token,
      1,
      10000,
      techniciansToFilter,
      ['in_progress', 'accepted', 'late', 'refused', 'billed'],
      '',
      dateStart,
      dateEnd
    );

    const invoicesRequest = this.invoiceService.getAllInvoices(
      token,
      1,
      10000,
      techniciansToFilter,
      '',
      dateStart,
      dateEnd
    );

    const revenueByCategoryRequest = this.receiptService.getRevenueByCategory(
      token,
      dateStart,
      dateEnd,
      techniciansToFilter
    );

    forkJoin({
      receiptsResponse: receiptsRequest,
      invoicesResponse: invoicesRequest,
      revenueByCategoryResponse: revenueByCategoryRequest,
    }).subscribe(
      (response) => {
        console.log('Filter response:', response);
        const { receiptsResponse, invoicesResponse, revenueByCategoryResponse } = response;
        this.allReceipts = receiptsResponse.receipts;
        this.allInvoices = invoicesResponse.invoices;

        const repasCategory = revenueByCategoryResponse.value.data.find(
          (cat: any) => cat.label === 'Repas'
        );

        const revenueByCategory = repasCategory
          ? repasCategory.subcategories
          : [];

        this.processData(revenueByCategory);
      }
    );
  }

  processData(revenueByCategory: any[] = []) {
    this.calculateTotalRevenue(this.allReceipts);
    this.updateSalesOverTimeChart(this.allReceipts);
    this.calculateTotalInvoices(this.allInvoices);
    this.updateSalesByCategoryChart(revenueByCategory);
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
      case 'custom':
        this.startDate = null;
        this.endDate = null;
        break;
    }
  }

  onPeriodChange(period: string) {
    this.setPeriod(period);
    if (period !== 'custom') {
      this.fetchData();
    }
  }

  onDateRangeChange(dateRange: DateRange) {
    this.dateRange = dateRange;
    if (dateRange.from && dateRange.to) {
      this.startDate = dateRange.from;
      this.endDate = dateRange.to;
      this.fetchData();
    }
  }

  onResponsableChange(responsableId: string) {
    this.responsableFilter.set(responsableId);
    this.fetchData();
  }

  calculateTotalRevenue(receipts: Receipt[]) {
    const filteredReceipts = receipts.filter(
      (receipt) => receipt.status !== 'billed'
    );
    const revenue = filteredReceipts.reduce(
      (sum, receipt) => sum + receipt.total,
      0
    );
    this.totalRevenue.set(parseFloat(revenue.toFixed(2)));
    this.totalReceipts.set(filteredReceipts.length);
  }

  calculateTotalInvoices(invoices: Invoice[]) {
    const revenue = invoices.reduce(
      (sum, invoice) => sum + (invoice.totalTTC || invoice.total),
      0
    );
    this.totalInvoicesRevenue.set(parseFloat(revenue.toFixed(2)));
    this.totalInvoices.set(invoices.length);
  }

  updateSalesByCategoryChart(revenueData: any[]) {
    const categorySales = new Map<string, number>();
    revenueData.forEach((item: any) => {
      categorySales.set(item.label, item.count);
    });

    const totalSales = [...categorySales.values()].reduce(
      (acc, v) => acc + v,
      0
    );

    const chartData = {
      labels: [...categorySales.keys()],
      datasets: [
        {
          label: 'Ventes par Catégorie',
          data: [...categorySales.values()].map((v) =>
            parseFloat(v.toFixed(2))
          ),
          backgroundColor: [
            '#F87171',
            '#60A5FA',
            '#4ADE80',
            '#D1D5DB',
            '#FACC15',
            '#C084FC',
          ],
        },
      ],
    };

    const chartOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      radius: '80%',
      borderRadius: 5,
      plugins: {
        legend: {
          display: true,
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed) {
                label += new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(context.parsed);
              }
              return label;
            },
          },
        },
        centerText: {
          text: `${parseFloat(totalSales.toFixed(2))}`,
        },
      },
    };

    if (this.salesByCategoryChart) {
      this.salesByCategoryChart.data = chartData;
      this.salesByCategoryChart.options = chartOptions;
      this.salesByCategoryChart.update();
    } else {
      this.salesByCategoryChart = new Chart('salesByCategoryChart', {
        type: 'doughnut',
        data: chartData,
        options: chartOptions,
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
      new Date(date).toLocaleDateString('fr-FR')
    );

    const chartDataValues = sortedDates.map((date) => salesByDate.get(date)!);

    const chartData = {
      labels: chartLabels,
      datasets: [
        {
          label: 'Ventes au Fil du Temps',
          data: chartDataValues.map((v) => parseFloat(v.toFixed(2))),
          backgroundColor: '#4ADE80',
          barThickness: 25,
        },
      ],
    };

    if (this.salesOverTimeChart) {
      this.salesOverTimeChart.destroy();
    }
    this.salesOverTimeChart = new Chart('salesOverTimeChart', {
      type: 'bar',
      data: chartData,
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context: any) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y) {
                  label += new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(context.parsed.y);
                }
                return label;
              },
            },
          },
        },
      },
    });
  }

  exportToPDF(chartId: string) {
    const chart =
      chartId === 'salesByCategoryChart'
        ? this.salesByCategoryChart
        : this.salesOverTimeChart;
    if (!chart) {
      return;
    }

    const doc = new jsPDF();

    const canvas = chart.canvas;

    const chartDataURL = canvas.toDataURL('image/png');

    doc.setFontSize(18);
    doc.text(chart.data.datasets[0].label || 'Chart', 14, 22);

    const imgProps = doc.getImageProperties(chartDataURL);

    const pdfWidth = doc.internal.pageSize.getWidth();

    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    doc.addImage(chartDataURL, 'PNG', 10, 30, pdfWidth - 20, pdfHeight);

    const tableData = chart.data.labels!.map((label, index) => [
      label,
      chart.data.datasets[0].data[index],
    ]);

    autoTable(doc, {
      head: [['Label', 'Value']],
      body: tableData as any[][],
      startY: pdfHeight + 40,
    });

    doc.save(`${chartId}.pdf`);
  }
}
