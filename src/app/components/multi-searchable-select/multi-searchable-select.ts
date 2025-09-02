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
import { LucideAngularModule, Search, ChevronDown, Check } from 'lucide-angular';

export interface Option {
  value: string;
  label: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  selector: 'app-multi-searchable-select',
  templateUrl: './multi-searchable-select.html',
})
export class MultiSearchableSelectComponent {
  readonly Search = Search;
  readonly ChevronDown = ChevronDown;
  readonly Check = Check;

  @Input() options: Option[] = [];
  @Input() set value(val: string[]) {
    this._value = val;
  }
  get value(): string[] {
    return this._value;
  }
  private _value: string[] = [];
  @Input() placeholder: string = 'Select options...';
  @Input() disabled: boolean = false;
  @Input() className: string = '';

  @Output() valueChange = new EventEmitter<string[]>();

  open = false;
  searchTerm: string = '';

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('dropdownRef') dropdownRef!: ElementRef<HTMLDivElement>;

  get selectedOptions(): Option[] {
    return this.options.filter((option) => this.value.includes(option.value));
  }

  get filteredOptions(): Option[] {
    return this.options.filter((option) =>
      option.label.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get displayLabel(): string {
    const allOptionValues = this.options.filter(o => o.value !== 'all').map(o => o.value);
    const allSelected = allOptionValues.every(val => this.value.includes(val));

    if (allSelected && this.value.includes('all')) {
      return 'Tous les responsables'; // Or 'All'
    }
    if (this.value.length === 0) {
      return this.placeholder;
    }
    if (this.value.length === 1) {
      const selected = this.selectedOptions[0];
      return selected ? selected.label : this.placeholder;
    }
    if (this.value.length > 1) {
      return `${this.value.length} selected`;
    }
    return this.placeholder;
  }

  toggleDropdown() {
    if (!this.disabled) {
      this.open = !this.open;
      if (this.open) {
        setTimeout(() => this.inputRef?.nativeElement.focus(), 0);
      } else {
        this.searchTerm = ''; // Clear search term on close
      }
    }
  }

  selectOption(optionValue: string) {
    let newValue = [...this.value];
    const allOptionValues = this.options.filter(o => o.value !== 'all').map(o => o.value);

    if (optionValue === 'all') {
      if (newValue.includes('all')) {
        // If 'all' is currently selected, deselect all
        newValue = [];
      } else {
        // If 'all' is not selected, select all
        newValue = [...allOptionValues, 'all'];
      }
    } else {
      const index = newValue.indexOf(optionValue);
      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(optionValue);
      }

      // After adding/removing a non-'all' option, adjust 'all' status
      const currentlySelectedNonAll = newValue.filter(val => val !== 'all');
      const allOthersSelected = allOptionValues.every(val => currentlySelectedNonAll.includes(val));

      if (allOthersSelected) {
        if (!newValue.includes('all')) {
          newValue.push('all');
        }
      } else {
        newValue = newValue.filter(val => val !== 'all');
      }
    }
    this.valueChange.emit(newValue);
  }

  isSelected(optionValue: string): boolean {
    return this.value.includes(optionValue);
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
