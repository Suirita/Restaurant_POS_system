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
  selector: 'app-custom-select',
  templateUrl: './custom-select.html',
})
export class CustomSelectComponent {
  @Input() options: Option[] = [];
  @Input() value: string = '';
  @Input() placeholder: string = 'Select an option...';
  @Input() disabled: boolean = false;
  @Input() className: string = '';

  @Output() valueChange = new EventEmitter<string>();

  isOpen = false;
  focusedIndex = -1;

  @ViewChild('selectRef') selectRef!: ElementRef<HTMLDivElement>;

  get selectedOption(): Option | undefined {
    return this.options.find((option) => option.value === this.value);
  }

  toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      this.focusedIndex = -1;
    }
  }

  selectOption(optionValue: string) {
    this.valueChange.emit(optionValue);
    this.isOpen = false;
    this.focusedIndex = -1;
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
