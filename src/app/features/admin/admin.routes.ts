import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'usuarios',
    pathMatch: 'full',
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./pages/usuarios/usuarios.page').then((m) => m.AdminUsersPage),
  },
  {
    path: 'usuarios/novo',
    loadComponent: () =>
      import('./pages/usuario-novo/usuario-novo.page').then((m) => m.AdminUserCreatePage),
  },
];
