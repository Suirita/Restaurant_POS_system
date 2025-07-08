import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Import new components
import { UsersSettingsComponent } from './users-settings/users-settings';
import { CategoriesSettingsComponent } from './categories-settings/categories-settings';
import { MealsSettingsComponent } from './meals-settings/meals-settings';
import { RoomsSettingsComponent } from './rooms-settings/rooms-settings';
import { ReceiptsSettingsComponent } from './receipts-settings/receipts-settings';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [
    RouterLink,
    CommonModule,
    UsersSettingsComponent,
    CategoriesSettingsComponent,
    MealsSettingsComponent,
    RoomsSettingsComponent,
    ReceiptsSettingsComponent,
  ],
  templateUrl: './settings.html',
})
export class SettingsComponent {
  selectedSection = signal<string>('users'); // Default to 'users'

  selectSection(section: string) {
    this.selectedSection.set(section);
  }
}
