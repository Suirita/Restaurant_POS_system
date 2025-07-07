import { Routes } from '@angular/router';
import { PosComponent } from './pos/pos';
import { SettingsComponent } from './components/settings/settings';
import { ReportComponent } from './components/report/report';

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
  },
  {
    path: 'reports',
    component: ReportComponent,
  },
];
