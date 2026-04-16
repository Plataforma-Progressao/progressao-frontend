import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthStateService } from './auth-state.service';

describe('AuthStateService', () => {
  let service: AuthStateService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthStateService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    localStorage.clear();
  });

  it('stores the backend session after login', async () => {
    const loginPromise = service.login({
      email: 'manuel.rocha@universidade.br',
      password: 'password123',
    });

    const loginRequest = httpTestingController.expectOne('http://localhost:3000/api/auth/login');
    loginRequest.flush({
      success: true,
      data: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '1',
          email: 'manuel.rocha@universidade.br',
          name: 'Dr. Manuel Rocha',
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });

    await loginPromise;

    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()?.name).toBe('Dr. Manuel Rocha');
    expect(localStorage.getItem('plataforma-progressao.auth.session')).toContain('access-token');
  });

  it('clears invalid stored sessions during validation', async () => {
    localStorage.setItem(
      'plataforma-progressao.auth.session',
      JSON.stringify({
        accessToken: 'stale-token',
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

    const validationPromise = service.ensureSessionValid();
    const validationRequest = httpTestingController.expectOne('http://localhost:3000/api/users/me');
    validationRequest.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(await validationPromise).toBe(false);
    expect(service.isAuthenticated()).toBe(false);
  });

  it('clears local session immediately during logout before backend response', async () => {
    const loginPromise = service.login({
      email: 'manuel.rocha@universidade.br',
      password: 'password123',
    });

    const loginRequest = httpTestingController.expectOne('http://localhost:3000/api/auth/login');
    loginRequest.flush({
      success: true,
      data: {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: '1',
          email: 'manuel.rocha@universidade.br',
          name: 'Dr. Manuel Rocha',
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
    await loginPromise;

    const logoutPromise = service.logout();
    const logoutRequest = httpTestingController.expectOne('http://localhost:3000/api/auth/logout');

    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem('plataforma-progressao.auth.session')).toBeNull();

    logoutRequest.flush({ success: true, data: { revoked: true } });
    await logoutPromise;
  });
});
