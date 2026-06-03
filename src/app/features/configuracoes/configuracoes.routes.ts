import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/configuracoes-home/configuracoes-home.page').then((m) => m.ConfiguracoesHomePage),
  },
];
