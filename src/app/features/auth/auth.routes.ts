import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'cadastro',
    loadComponent: () =>
      import('./pages/signup/signup.page').then((m) => m.SignupPage),
  },
  {
    path: 'recuperar-senha',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password.page').then(
        (m) => m.ForgotPasswordPage,
      ),
  },
];
