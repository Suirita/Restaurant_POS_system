import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.html',
  imports: [CommonModule],
})
export class ConfirmationModalComponent {
  message = input.required<string>();
  isVisible = input.required<boolean>();

  confirmed = output<void>();
  cancelled = output<void>();

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.cancelled.emit();
  }
}
