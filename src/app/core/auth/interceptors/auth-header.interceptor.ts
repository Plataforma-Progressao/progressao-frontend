import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStateService } from '../auth-state.service';
import { getApiUrl } from '../../config/runtime-config';
import { SKIP_AUTH } from './auth-context.tokens';

export const authHeaderInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.context.get(SKIP_AUTH)) {
    return next(request);
  }

  const apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;

  if (!request.url.startsWith(apiBaseUrl)) {
    return next(request);
  }

  const authStateService = inject(AuthStateService);
  const accessToken = authStateService.getAccessToken();

  if (!accessToken) {
    return next(request);
  }

  if (request.headers.has('Authorization')) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );
};
