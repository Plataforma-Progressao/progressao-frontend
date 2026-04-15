import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../dashboard/pages/dashboard-placeholder/dashboard-placeholder.page').then(
        (m) => m.DashboardPlaceholderPage,
      ),
    data: {
      title: 'Checklist',
      description: 'Revise pendências e etapas obrigatórias antes do envio final.',
    },
  },
];
