import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

export const authGuard: CanMatchFn = async (_route, segments) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if (await authStateService.ensureSessionValid()) {
    return true;
  }

  const attemptedUrl = `/${segments.map((segment) => segment.path).join('/')}`;

  return router.createUrlTree(['/login'], {
    queryParams: {
      returnUrl: attemptedUrl || '/dashboard',
    },
  });
};
