import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../dashboard/pages/dashboard-placeholder/dashboard-placeholder.page').then(
        (m) => m.DashboardPlaceholderPage,
      ),
    data: {
      title: 'Atividades',
      description: 'Centralize aqui as atividades acadêmicas em andamento.',
    },
  },
];
