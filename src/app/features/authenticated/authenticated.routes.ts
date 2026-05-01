import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../core/layout/authenticated-shell/authenticated-shell.component').then(
        (m) => m.AuthenticatedShellComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.routes').then((m) => m.routes),
      },
      {
        path: 'atividades',
        loadChildren: () => import('../atividades/atividades.routes').then((m) => m.routes),
      },
      {
        path: 'checklist',
        loadChildren: () => import('../checklist/checklist.routes').then((m) => m.routes),
      },
      {
        path: 'relatorios',
        loadChildren: () => import('../reports/reports.routes').then((m) => m.routes),
      },
      {
        path: 'configuracoes',
        loadChildren: () => import('../configuracoes/configuracoes.routes').then((m) => m.routes),
      },
    ],
  },
];
