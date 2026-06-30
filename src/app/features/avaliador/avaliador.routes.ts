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
    path: 'checklist',
    loadComponent: () =>
      import('./pages/checklist-lista/checklist-lista.page').then((m) => m.EvaluatorChecklistListPage),
  },
  {
    path: 'checklist/:id',
    loadComponent: () =>
      import('./pages/checklist-revisao/checklist-revisao.page').then((m) => m.EvaluatorChecklistReviewPage),
  },
  {
    path: 'atividades/:id',
    loadComponent: () =>
      import('./pages/revisao/revisao.page').then((m) => m.EvaluatorReviewPage),
  },
];
