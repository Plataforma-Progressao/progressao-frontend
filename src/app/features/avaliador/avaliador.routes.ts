import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/fila/fila.page').then((m) => m.EvaluatorQueuePage),
  },
  {
    path: 'atividades/:id',
    loadComponent: () =>
      import('./pages/revisao/revisao.page').then((m) => m.EvaluatorReviewPage),
  },
];
