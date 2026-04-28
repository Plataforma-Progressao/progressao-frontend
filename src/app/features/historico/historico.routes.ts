import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages / historico-home/historico-home.page').then(
        (m) => m.HistoricoHomePage,
      ),
    data: {
      title: 'Histórico',
      description: 'Acompanhe as submissões, registros e validações anteriores.',
    },
  },
];
