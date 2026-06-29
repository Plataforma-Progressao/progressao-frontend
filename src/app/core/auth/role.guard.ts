import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthRole } from './auth.models';
import { AuthStateService } from './auth-state.service';

export function roleGuard(requiredRoles: readonly AuthRole[]): CanMatchFn {
  return async (_route, segments) => {
    const authStateService = inject(AuthStateService);
    const router = inject(Router);

    if (!(await authStateService.ensureSessionValid())) {
      const attemptedUrl = `/${segments.map((segment) => segment.path).join('/')}`;
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: attemptedUrl || '/dashboard' },
      });
    }

    if (authStateService.hasAnyRole(requiredRoles)) {
      return true;
    }

    return router.createUrlTree([authStateService.getDefaultRoute()]);
  };
}
