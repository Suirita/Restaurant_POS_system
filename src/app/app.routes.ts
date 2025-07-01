import { Routes } from '@angular/router';
import { PosComponent } from './pos/pos';

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
];
