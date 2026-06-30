import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

export const defaultRouteGuard: CanMatchFn = async () => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if (!(await authStateService.ensureSessionValid())) {
    return router.createUrlTree(['/login']);
  }

  return router.createUrlTree([authStateService.getDefaultRoute()]);
};
