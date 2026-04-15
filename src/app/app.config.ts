import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { authHeaderInterceptor } from './core/auth/interceptors/auth-header.interceptor';
import { authRefreshInterceptor } from './core/auth/interceptors/auth-refresh.interceptor';
import { httpErrorInterceptor } from './core/http/interceptors/http-error.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([httpErrorInterceptor, authHeaderInterceptor, authRefreshInterceptor])),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule),
  ],
};
