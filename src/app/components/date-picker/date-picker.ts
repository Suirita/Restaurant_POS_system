import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Calendar,
} from 'lucide-angular';

@Component({
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  selector: 'app-date-picker',
  templateUrl: './date-picker.html',
})
export class DatePickerComponent {
  readonly Calendar = Calendar;

  @Input() selected?: Date;
  @Input() placeholder: string = 'Pick a date';
  @Input() className: string = '';
  @Output() selectedChange = new EventEmitter<Date | undefined>();

  isOpen = false;
  currentMonth: number;
  currentYear: number;

  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;

  MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];
  WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  constructor() {
    const today = new Date();
    this.currentMonth = this.selected?.getMonth() ?? today.getMonth();
    this.currentYear = this.selected?.getFullYear() ?? today.getFullYear();
  }

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  // Close when clicking outside
  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (this.containerRef && !this.containerRef.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  getDaysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  getFirstDayOfMonth(month: number, year: number): number {
    return new Date(year, month, 1).getDay();
  }

  generateCalendarDays(): (number | null)[] {
    const daysInMonth = this.getDaysInMonth(this.currentMonth, this.currentYear);
    const firstDay = this.getFirstDayOfMonth(this.currentMonth, this.currentYear);

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  }

  handleDateSelect(day: number) {
    this.selected = new Date(this.currentYear, this.currentMonth, day);
    this.selectedChange.emit(this.selected);
    this.isOpen = false;
  }

  navigateMonth(direction: 'prev' | 'next') {
    if (direction === 'prev') {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    } else {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    }
  }

  isSelectedDate(day: number): boolean {
    if (!this.selected) return false;
    return (
      this.selected.getDate() === day &&
      this.selected.getMonth() === this.currentMonth &&
      this.selected.getFullYear() === this.currentYear
    );
  }

  isToday(day: number): boolean {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === this.currentMonth &&
      today.getFullYear() === this.currentYear
    );
  }

  formatSelected(): string {
    if (!this.selected) return this.placeholder;
    return this.selected.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
