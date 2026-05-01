import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/report-view/report-view.page').then((m) => m.ReportViewPage),
    data: {
      title: 'Relatórios',
      description: 'Visualize o RAD e exporte em PDF pela impressao do navegador.',
    },
  },
];
