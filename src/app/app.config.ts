import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { authHeaderInterceptor } from './core/auth/interceptors/auth-header.interceptor';
import { authRefreshInterceptor } from './core/auth/interceptors/auth-refresh.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authHeaderInterceptor, authRefreshInterceptor])),
    provideRouter(routes),
    provideAnimations(),
  ],
};
