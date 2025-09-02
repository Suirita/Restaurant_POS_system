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

export interface Option {
  value: string;
  label: string;
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-multi-select',
  templateUrl: './multi-select.html',
})
export class MultiSelectComponent {
  @Input() options: Option[] = [];
  @Input() set value(val: string[]) {
    console.log('value', val);
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

  isOpen = false;
  focusedIndex = -1;

  @ViewChild('selectRef') selectRef!: ElementRef<HTMLDivElement>;

  get selectedOptions(): Option[] {
    console.log('selectedOptions', this.options, this.value);
    return this.options.filter((option) => this.value.includes(option.value));
  }

  get displayLabel(): string {
    console.log('displayLabel', this.value);
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
    console.log('toggleDropdown');
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      this.focusedIndex = -1;
    }
  }

  selectOption(optionValue: string) {
    console.log('selectOption', optionValue);
    const newValue = [...this.value];
    const index = newValue.indexOf(optionValue);

    if (index > -1) {
      newValue.splice(index, 1);
    } else {
      newValue.push(optionValue);
    }
    this.valueChange.emit(newValue);
  }

  isSelected(optionValue: string): boolean {
    return this.value.includes(optionValue);
  }

  // Handle outside click
  @HostListener('document:mousedown', ['$event'])
  handleClickOutside(event: MouseEvent) {
    if (
      this.selectRef &&
      !this.selectRef.nativeElement.contains(event.target as Node)
    ) {
      this.isOpen = false;
      this.focusedIndex = -1;
    }
  }

  // Handle keyboard navigation
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex =
          this.focusedIndex < this.options.length - 1
            ? this.focusedIndex + 1
            : 0;
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex =
          this.focusedIndex > 0
            ? this.focusedIndex - 1
            : this.options.length - 1;
        break;
      case 'Enter':
        event.preventDefault();
        if (this.focusedIndex >= 0) {
          this.selectOption(this.options[this.focusedIndex].value);
        }
        break;
      case 'Escape':
        this.isOpen = false;
        this.focusedIndex = -1;
        break;
    }
  }
}