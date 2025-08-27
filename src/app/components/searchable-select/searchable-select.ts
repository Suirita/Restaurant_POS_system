import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, ChevronDown } from 'lucide-angular';

interface Option {
  value: string;
  label: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.html',
})
export class SearchableSelectComponent {
  readonly Search = Search;
  readonly ChevronDown = ChevronDown;

  @Input() options: Option[] = [];
  @Input() placeholder: string = 'Select an option...';
  @Input() value: string = '';
  @Input() className: string = '';
  @Output() valueChange = new EventEmitter<string>();

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('dropdownRef') dropdownRef!: ElementRef<HTMLDivElement>;

  open = false;
  searchTerm: string = '';

  get selectedOption(): Option | undefined {
    return this.options.find((o) => o.value === this.value);
  }

  get filteredOptions(): Option[] {
    return this.options.filter((option) =>
      option.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleDropdown() {
    this.open = !this.open;
    if (this.open) {
      setTimeout(() => this.inputRef?.nativeElement.focus(), 0);
    }
  }

  handleSelect(optionValue: string) {
    this.value = optionValue === this.value ? '' : optionValue;
    this.valueChange.emit(this.value);
    this.open = false;
    this.searchTerm = '';
  }

  // Detect click outside to close dropdown
  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (
      this.open &&
      this.dropdownRef &&
      !this.dropdownRef.nativeElement.contains(event.target as Node)
    ) {
      this.open = false;
      this.searchTerm = '';
    }
  }
}
