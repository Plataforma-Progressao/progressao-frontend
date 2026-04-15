import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'dashboard',
    canMatch: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.routes),
  },
];
