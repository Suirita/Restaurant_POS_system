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
  LayoutDashboard,
  Settings,
  Receipt,
  ReceiptText,
  HandPlatter,
  FileText,
  LogOut,
} from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-report',
  imports: [
    RouterLink,
    CommonModule,
    RouterOutlet,
    RouterLinkActive,
    LucideAngularModule,
  ],
  templateUrl: './report.html',
})
export class ReportComponent {
  private router = inject(Router);

  readonly LayoutDashboard = LayoutDashboard;
  readonly Settings = Settings;
  readonly Receipt = Receipt;
  readonly ReceiptText = ReceiptText;
  readonly HandPlatterIcon = HandPlatter;
  readonly FileText = FileText;
  readonly LogOutIcon = LogOut;

  userRole(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role?.label || '';
  }

  onPos(): void {
    this.router.navigate(['/pos']);
  }

  onSettings(): void {
    this.router.navigate(['/settings']);
  }

  onLogout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/pos']);
  }
}
