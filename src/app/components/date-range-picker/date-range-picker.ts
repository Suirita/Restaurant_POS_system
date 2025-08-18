import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DateRange {
  from?: Date;
  to?: Date;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.html',
})
export class DateRangePickerComponent {
  @Input() value: DateRange = {};
  @Input() placeholder: string = 'Pick a date range';
  @Input() className: string = '';
  @Output() valueChange = new EventEmitter<DateRange>();

  isOpen = false;
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  hoverDate: Date | null = null;
  today = new Date();

  MONTHS = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  DAYS = ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'];

  toggleOpen() {
    this.isOpen = !this.isOpen;
  }

  getDaysInMonth(month: number, year: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  getFirstDayOfMonth(month: number, year: number): number {
    return new Date(year, month, 1).getDay();
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  isInRange(date: Date, from?: Date, to?: Date): boolean {
    if (!from || !to) return false;
    return date >= from && date <= to;
  }

  isHovering(date: Date): boolean {
    if (!this.value?.from || this.value?.to || !this.hoverDate) {
      return false;
    }
    const fromTime = this.value.from.getTime();
    const hoverTime = this.hoverDate.getTime();
    const dateTime = date.getTime();

    if (fromTime < hoverTime) {
      return dateTime > fromTime && dateTime < hoverTime;
    } else {
      return dateTime < fromTime && dateTime > hoverTime;
    }
  }

  isRangeStart(date: Date): boolean {
    return this.value?.from ? this.isSameDay(date, this.value.from) : false;
  }

  isRangeEnd(date: Date): boolean {
    return this.value?.to ? this.isSameDay(date, this.value.to) : false;
  }

  handleDateClick(date: Date) {
    if (!this.value?.from || (this.value.from && this.value.to)) {
      // Start new range
      this.value = { from: date, to: undefined };
      this.valueChange.emit(this.value);
    } else if (this.value.from && !this.value.to) {
      // Complete range
      if (date < this.value.from) {
        this.value = { from: date, to: this.value.from };
      } else {
        this.value = { from: this.value.from, to: date };
      }
      this.valueChange.emit(this.value);
      this.isOpen = false;
    }
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

  renderCalendar(): (number | null)[] {
    const daysInMonth = this.getDaysInMonth(
      this.currentMonth,
      this.currentYear
    );
    const firstDay = this.getFirstDayOfMonth(
      this.currentMonth,
      this.currentYear
    );

    const days: (number | null)[] = [];

    // Empty slots before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }

  formatDateRange(): string {
    if (!this.value?.from) return this.placeholder;
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    if (!this.value?.to) return this.value.from.toLocaleDateString('fr-FR', options);
    return `${this.value.from.toLocaleDateString('fr-FR', options)} - ${this.value.to.toLocaleDateString('fr-FR', options)}`;
  }

  createNewDate(day: number): Date {
    return new Date(this.currentYear, this.currentMonth, day);
  }
}