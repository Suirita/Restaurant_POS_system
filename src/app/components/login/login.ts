import { Component, EventEmitter, Output, signal, computed } from '@angular/core';
import type { UserAccount } from '../../types/pos.types';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Lock, EyeOff, Eye, User, ChevronLeft } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, CommonModule, LucideAngularModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  readonly LockIcon = Lock;
  readonly EyeOffIcon = EyeOff;
  readonly EyeIcon = Eye;
  readonly UserIcon = User;
  readonly BackspaceIcon = ChevronLeft;

  @Output() loginSuccess = new EventEmitter<UserAccount>();
  userAccounts: UserAccount[] = [
    { userId: '1', username: 'user1', password: '1' },
    { userId: '2', username: 'user2', password: '2' },
    { userId: '3', username: 'user3', password: '3' },
  ];

  password = signal<string>('');
  showPassword = signal<boolean>(false);
  loginError = signal<string>('');
  isLoading = signal<boolean>(false);

  passwordDisplay = computed(() => {
    return this.showPassword() ? this.password() : '* '.repeat(this.password().length);
  });

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onNumberClick(num: string) {
    this.password.set(this.password() + num);
    this.loginError.set(''); // Clear error on new input
  }

  onClearClick() {
    this.password.set('');
    this.loginError.set('');
  }

  onBackspaceClick() {
    this.password.set(this.password().slice(0, -1));
    this.loginError.set('');
  }

  onLogin() {
    if (!this.password()) {
      this.loginError.set('Please enter password');
      return;
    }

    this.isLoading.set(true);
    this.loginError.set('');

    // Simulate login delay
    setTimeout(() => {
      const user = this.userAccounts.find(
        (u) => u.password === this.password()
      );

      if (user) {
        this.loginSuccess.emit(user);
      } else {
        this.loginError.set('Invalid password. Please try again.');
        this.password.set('');
      }

      this.isLoading.set(false);
    }, 1000);
  }

  onPasswordKeyPress(event: KeyboardEvent) {
    // This method is no longer needed as input is handled by number pad
  }
}
