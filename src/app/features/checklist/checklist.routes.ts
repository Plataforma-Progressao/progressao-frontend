import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../shared/components/placeholder-page/placeholder-page.component').then(
        (m) => m.PlaceholderPageComponent,
      ),
    data: {
      title: 'Checklist',
      description: 'Revise pendências e etapas obrigatórias antes do envio final.',
    },
  },
];
