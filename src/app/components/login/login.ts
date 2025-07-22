import {
  Component,
  EventEmitter,
  Output,
  signal,
  computed,
  inject,
} from '@angular/core';
import type { UserAccount } from '../../types/pos.types';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Lock,
  EyeOff,
  Eye,
  User,
  ChevronLeft,
} from 'lucide-angular';
import { LoginService } from '../../login.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  private loginService = inject(LoginService);

  password = signal<string>('');
  showPassword = signal<boolean>(false);
  loginError = signal<string>('');
  isLoading = signal<boolean>(false);

  passwordDisplay = computed(() => {
    return this.showPassword()
      ? this.password()
      : '* '.repeat(this.password().length);
  });

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onNumberClick(num: string) {
    if (this.password().length >= 4) return;
    this.password.set(this.password() + num);
    this.loginError.set(''); // Clear error on new input

    if (this.password().length === 4) {
      this.onLogin();
    }
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
    const body = {
      userName: this.password(),
      password: 'demodemo',
    };

    this.loginService
      .login(body)
      .pipe(
        tap((userAccount) => {
          this.loginSuccess.emit(userAccount);
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.loginError.set('Invalid password. Please try again.');
          this.password.set('');
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe();
  }
}
