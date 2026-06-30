import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/admin-dashboard.page').then((m) => m.AdminDashboardPage),
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
  {
    path: 'atribuicoes',
    loadComponent: () =>
      import('./pages/atribuicoes/atribuicoes.page').then((m) => m.AdminAssignmentsPage),
  },
];
