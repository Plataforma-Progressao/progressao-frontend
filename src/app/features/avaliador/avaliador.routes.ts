import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/evaluator-dashboard.page').then((m) => m.EvaluatorDashboardPage),
  },
  {
    path: 'fila',
    loadComponent: () =>
      import('./pages/fila/fila.page').then((m) => m.EvaluatorQueuePage),
  },
  {
    path: 'atividades/:id',
    loadComponent: () =>
      import('./pages/revisao/revisao.page').then((m) => m.EvaluatorReviewPage),
  },
];
