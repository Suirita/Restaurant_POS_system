import { Routes } from '@angular/router';
import { PosComponent } from './pos/pos';
import { SettingsComponent } from './components/settings/settings';
import { ReportComponent } from './components/report/report';
import { UsersSettingsComponent } from './components/settings/users-settings/users-settings';
import { CategoriesSettingsComponent } from './components/settings/categories-settings/categories-settings';
import { MealsSettingsComponent } from './components/settings/meals-settings/meals-settings';
import { RoomsSettingsComponent } from './components/settings/rooms-settings/rooms-settings';
import { ReceiptsSettingsComponent } from './components/settings/receipts-settings/receipts-settings';
import { CompanySettingsComponent } from './components/settings/company-settings/company-settings';
import { ClientsSettingsComponent } from './components/settings/clients-settings/clients-settings';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pos',
    pathMatch: 'full',
  },
  {
    path: 'pos',
    component: PosComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UsersSettingsComponent },
      { path: 'categories', component: CategoriesSettingsComponent },
      { path: 'meals', component: MealsSettingsComponent },
      { path: 'rooms', component: RoomsSettingsComponent },
      { path: 'receipts', component: ReceiptsSettingsComponent },
      { path: 'company', component: CompanySettingsComponent },
      { path: 'clients', component: ClientsSettingsComponent },
    ],
  },
  {
    path: 'reports',
    component: ReportComponent,
  },
];
