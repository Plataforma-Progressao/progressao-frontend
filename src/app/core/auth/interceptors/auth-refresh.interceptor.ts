import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthStateService } from '../auth-state.service';
import { getApiUrl } from '../../config/runtime-config';
import { AUTH_RETRY, SKIP_AUTH } from './auth-context.tokens';

function isBackendApiRequest(request: HttpRequest<unknown>): boolean {
  const apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;
  return request.url.startsWith(apiBaseUrl);
}

function shouldSkipRefresh(request: HttpRequest<unknown>): boolean {
  if (request.context.get(SKIP_AUTH)) {
    return true;
  }

  return (
    request.url.includes('/auth/login') ||
    request.url.includes('/auth/register') ||
    request.url.includes('/auth/refresh')
  );
}

function retryWithToken(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  token: string,
): Observable<HttpEvent<unknown>> {
  return next(
    request.clone({
      context: request.context.set(AUTH_RETRY, true),
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
}

export const authRefreshInterceptor: HttpInterceptorFn = (request, next) => {
  const authStateService = inject(AuthStateService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      if (!isBackendApiRequest(request)) {
        return throwError(() => error);
      }

      if (request.context.get(AUTH_RETRY)) {
        authStateService.clearSession();
        return throwError(() => error);
      }

      if (shouldSkipRefresh(request)) {
        return throwError(() => error);
      }

      if (!authStateService.hasRefreshToken()) {
        authStateService.clearSession();
        return throwError(() => error);
      }

      return from(authStateService.refreshSession()).pipe(
        switchMap((refreshSucceeded) => {
          if (!refreshSucceeded) {
            return throwError(() => error);
          }

          const refreshedToken = authStateService.getAccessToken();

          if (!refreshedToken) {
            return throwError(() => error);
          }

          return retryWithToken(request, next, refreshedToken);
        }),
        catchError((refreshError: unknown) => throwError(() => refreshError)),
      );
    }),
  );
};
