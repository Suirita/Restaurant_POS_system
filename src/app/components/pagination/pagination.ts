import {
  Component,
  Output,
  EventEmitter,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './pagination.html',
})
export class PaginationComponent {
  totalItems = input.required<number>();
  pageSize = input(10);
  currentPage = input.required<number>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pageSizes = [10, 15, 20, 25];

  ChevronsLeft = ChevronsLeft;
  ChevronLeft = ChevronLeft;
  ChevronRight = ChevronRight;
  ChevronsRight = ChevronsRight;

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
  startEntry = computed(() => (this.currentPage() - 1) * this.pageSize() + 1);
  endEntry = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalItems())
  );
  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
      this.pageChange.emit(page);
    }
  }

  nextPage() {
    this.goToPage(this.currentPage() + 1);
  }

  previousPage() {
    this.goToPage(this.currentPage() - 1);
  }
}
