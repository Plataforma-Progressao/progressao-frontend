import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';
import { defaultRouteGuard } from '../../core/auth/default-route.guard';
import { roleGuard } from '../../core/auth/role.guard';

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
        canMatch: [defaultRouteGuard],
        loadComponent: () =>
          import('../../core/auth/empty-route.component').then((m) => m.EmptyRouteComponent),
      },
      {
        path: 'dashboard',
        canMatch: [authGuard, roleGuard(['USER'])],
        loadChildren: () => import('../dashboard/dashboard.routes').then((m) => m.routes),
      },
      {
        path: 'atividades',
        canMatch: [authGuard, roleGuard(['USER'])],
        loadChildren: () => import('../atividades/atividades.routes').then((m) => m.routes),
      },
      {
        path: 'checklist',
        canMatch: [authGuard, roleGuard(['USER'])],
        loadChildren: () => import('../checklist/checklist.routes').then((m) => m.routes),
      },
      {
        path: 'relatorios',
        canMatch: [authGuard, roleGuard(['USER'])],
        loadChildren: () => import('../reports/reports.routes').then((m) => m.routes),
      },
      {
        path: 'configuracoes',
        canMatch: [authGuard, roleGuard(['USER'])],
        loadChildren: () => import('../configuracoes/configuracoes.routes').then((m) => m.routes),
      },
      {
        path: 'avaliador',
        canMatch: [authGuard, roleGuard(['EVALUATOR'])],
        loadChildren: () => import('../avaliador/avaliador.routes').then((m) => m.routes),
      },
      {
        path: 'admin',
        canMatch: [authGuard, roleGuard(['ADMIN'])],
        loadChildren: () => import('../admin/admin.routes').then((m) => m.routes),
      },
    ],
  },
];
