import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/components/placeholder-page/placeholder-page.component').then(
        (m) => m.PlaceholderPageComponent,
      ),
    data: {
      title: 'Atividades',
      description: 'Centralize aqui as atividades acadêmicas em andamento.',
    },
  },
];
