import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/atividades/atividades.page').then((m) => m.ActivitiesPage),
        data: {
          title: 'Atividades',
          description: 'Centralize aqui as atividades acadêmicas em andamento.',
        },
      },
      {
        path: 'nova',
        loadComponent: () =>
          import('./pages/atividade-create/atividade-create.page').then(
            (m) => m.ActivityCreatePage,
          ),
        data: {
          title: 'Nova Atividade Acadêmica',
          description: 'Registre uma nova atividade para cálculo do progresso funcional.',
        },
      },
      {
        path: 'editar/:id',
        loadComponent: () =>
          import('./pages/atividade-create/atividade-create.page').then(
            (m) => m.ActivityCreatePage,
          ),
        data: {
          title: 'Editar Atividade Acadêmica',
          description: 'Atualize os dados de uma atividade já registrada.',
        },
      },
    ],
  },
];
