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
import { DashboardComponent } from './components/report/dashboard/dashboard';
import { ReceiptsComponent } from './components/report/receipts/receipts';
import { invoicesComponent } from './components/report/invoices/invoices';

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
      { path: '', redirectTo: 'company', pathMatch: 'full' },
      { path: 'company', component: CompanySettingsComponent },
      { path: 'receipts', component: ReceiptsSettingsComponent },
      { path: 'clients', component: ClientsSettingsComponent },
      { path: 'users', component: UsersSettingsComponent },
      { path: 'categories', component: CategoriesSettingsComponent },
      { path: 'meals', component: MealsSettingsComponent },
      { path: 'rooms', component: RoomsSettingsComponent },
    ],
  },
  {
    path: 'reports',
    component: ReportComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'receipts', component: ReceiptsComponent },
      { path: 'invoices', component: invoicesComponent },
    ],
  },
];
