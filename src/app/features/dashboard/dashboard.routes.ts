import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/dashboard-shell/dashboard-shell.component').then(
        (m) => m.DashboardShellComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard-home/dashboard-home.page').then((m) => m.DashboardHomePage),
      },
      {
        path: 'atividades',
        loadComponent: () =>
          import('./pages/dashboard-placeholder/dashboard-placeholder.page').then(
            (m) => m.DashboardPlaceholderPage,
          ),
        data: {
          title: 'Atividades',
          description: 'Centralize aqui as atividades acadêmicas em andamento.',
        },
      },
      {
        path: 'historico',
        loadComponent: () =>
          import('./pages/dashboard-placeholder/dashboard-placeholder.page').then(
            (m) => m.DashboardPlaceholderPage,
          ),
        data: {
          title: 'Histórico',
          description: 'Acompanhe as submissões, registros e validações anteriores.',
        },
      },
      {
        path: 'checklist',
        loadComponent: () =>
          import('./pages/dashboard-placeholder/dashboard-placeholder.page').then(
            (m) => m.DashboardPlaceholderPage,
          ),
        data: {
          title: 'Checklist',
          description: 'Revise pendências e etapas obrigatórias antes do envio final.',
        },
      },
      {
        path: 'relatorios',
        loadComponent: () =>
          import('./pages/dashboard-placeholder/dashboard-placeholder.page').then(
            (m) => m.DashboardPlaceholderPage,
          ),
        data: {
          title: 'Relatórios',
          description: 'Compare relatórios parciais, consolidados e históricos de progresso.',
        },
      },
      {
        path: 'configuracoes',
        loadComponent: () =>
          import('./pages/dashboard-placeholder/dashboard-placeholder.page').then(
            (m) => m.DashboardPlaceholderPage,
          ),
        data: {
          title: 'Configurações',
          description: 'Personalize preferências, acessos e parâmetros da conta.',
        },
      },
    ],
  },
];
