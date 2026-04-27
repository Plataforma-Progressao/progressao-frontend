//import { Routes } from '@angular/router';

//export const routes: Routes = [
//  {
//    path: '',
//    loadComponent: () =>
//      import('../../shared/components/placeholder-page/placeholder-page.component').then(
//        (m) => m.PlaceholderPageComponent,
//      ),
//    data: {
//      title: 'Configurações',
//      description: 'Personalize preferências, acessos e parâmetros da conta.',
//    },
//  },
//];

//import { Routes } from '@angular/router';
//import { ConfiguracoesHomePage } from './pages/configuracoes-home/configuracoes-home.page.html';

//export const configuracoesRoutes: Routes = [
//  {
//    path: '',
//    component: ConfiguracoesHomePage
//  }
//];

import { Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/configuracoes-home/configuracoes-home.page').then((m) => m.ConfiguracoesHomePage),
  },
];
