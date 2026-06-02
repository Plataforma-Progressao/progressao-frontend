import { ApplicationConfig, importProvidersFrom, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { authHeaderInterceptor } from './core/auth/interceptors/auth-header.interceptor';
import { authRefreshInterceptor } from './core/auth/interceptors/auth-refresh.interceptor';
import { httpErrorInterceptor } from './core/http/interceptors/http-error.interceptor';

import { provideEnvironmentNgxMask } from 'ngx-mask';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEnvironmentNgxMask({
      dropSpecialCharacters: false,
      validation: true,
      showMaskTyped: true,
    }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([httpErrorInterceptor, authHeaderInterceptor, authRefreshInterceptor])),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule, MatDialogModule),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
