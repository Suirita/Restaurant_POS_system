import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Building2,
  ReceiptText,
  Users,
  User,
  Tag,
  Utensils,
  Armchair,
  HandPlatter,
  FileText,
  LogOut,
} from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [
    RouterLink,
    CommonModule,
    RouterOutlet,
    RouterLinkActive,
    LucideAngularModule,
  ],
  templateUrl: './settings.html',
})
export class SettingsComponent {
  private router = inject(Router);

  readonly Building2 = Building2;
  readonly ReceiptText = ReceiptText;
  readonly Users = Users;
  readonly User = User;
  readonly Tag = Tag;
  readonly Utensils = Utensils;
  readonly Armchair = Armchair;
  readonly HandPlatterIcon = HandPlatter;
  readonly ReportsIcon = FileText;
  readonly LogOutIcon = LogOut;

  userRole(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role?.label || '';
  }

  onPos(): void {
    this.router.navigate(['/pos']);
  }

  onReports(): void {
    this.router.navigate(['/reports']);
  }

  onLogout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/pos']);
  }
}
