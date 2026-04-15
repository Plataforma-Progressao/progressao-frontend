import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthStateService } from './auth-state.service';

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
    localStorage.clear();
  });

  it('redirects anonymous users to login', async () => {
    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, [{ path: 'dashboard' } as never]),
    );

    const router = TestBed.inject(Router);

    expect(router.serializeUrl(result as never)).toContain('/login');
  });

  it('allows navigation with a valid backend session', async () => {
    localStorage.setItem(
      'plataforma-progressao.auth.session',
      JSON.stringify({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '1',
          email: 'manuel.rocha@universidade.br',
          name: 'Dr. Manuel Rocha',
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          title: 'Prof. Associado IV',
          avatarInitials: 'MR',
        },
        issuedAt: new Date().toISOString(),
        persistent: true,
      }),
    );

    const authStateService = TestBed.inject(AuthStateService);
    const httpTestingController = TestBed.inject(HttpTestingController);

    const validationPromise = authStateService.ensureSessionValid();
    const validationRequest = httpTestingController.expectOne('http://localhost:3000/api/users/me');
    validationRequest.flush({
      success: true,
      data: {
        id: '1',
        email: 'manuel.rocha@universidade.br',
        name: 'Dr. Manuel Rocha',
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    expect(await validationPromise).toBe(true);

    const result = await TestBed.runInInjectionContext(() =>
      authGuard({} as never, [{ path: 'dashboard' } as never]),
    );

    expect(result).toBe(true);
  });
});
