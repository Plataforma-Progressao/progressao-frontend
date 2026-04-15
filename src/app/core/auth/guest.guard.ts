import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';

export const guestGuard: CanMatchFn = async () => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if (await authStateService.ensureSessionValid()) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
