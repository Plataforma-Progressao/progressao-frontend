import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { authRefreshInterceptor } from './auth-refresh.interceptor';
import { AuthStateService } from '../auth-state.service';

describe('authRefreshInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authRefreshInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should refresh and retry request after 401', async () => {
    const authStateService = TestBed.inject(AuthStateService);
    vi.spyOn(authStateService, 'hasRefreshToken').mockReturnValue(true);
    vi.spyOn(authStateService, 'refreshSession').mockResolvedValue(true);
    vi.spyOn(authStateService, 'getAccessToken').mockReturnValue('new-access-token');

    const responsePromise = new Promise<unknown>((resolve) => {
      httpClient.get('http://localhost:3000/api/users/me').subscribe(resolve);
    });

    const firstRequest = httpTestingController.expectOne('http://localhost:3000/api/users/me');
    firstRequest.flush({}, { status: 401, statusText: 'Unauthorized' });

    await Promise.resolve();

    const retryRequest = httpTestingController.expectOne('http://localhost:3000/api/users/me');
    expect(retryRequest.request.headers.get('Authorization')).toBe('Bearer new-access-token');
    retryRequest.flush({ success: true, data: { id: '1' } });

    await expect(responsePromise).resolves.toBeDefined();
  });

  it('should clear session when refresh is not possible', async () => {
    const authStateService = TestBed.inject(AuthStateService);
    vi.spyOn(authStateService, 'hasRefreshToken').mockReturnValue(false);
    const clearSessionSpy = vi.spyOn(authStateService, 'clearSession');

    const errorPromise = new Promise<HttpErrorResponse>((resolve) => {
      httpClient.get('http://localhost:3000/api/users/me').subscribe({
        error: (error: HttpErrorResponse) => resolve(error),
      });
    });

    const request = httpTestingController.expectOne('http://localhost:3000/api/users/me');
    request.flush({}, { status: 401, statusText: 'Unauthorized' });

    const error = await errorPromise;
    expect(error.status).toBe(401);
    expect(clearSessionSpy).toHaveBeenCalled();
  });

  it('should not attempt refresh for non-backend requests', async () => {
    const authStateService = TestBed.inject(AuthStateService);
    const refreshSpy = vi.spyOn(authStateService, 'refreshSession');

    const errorPromise = new Promise<HttpErrorResponse>((resolve) => {
      httpClient.get('https://third-party.example.com/profile').subscribe({
        error: (error: HttpErrorResponse) => resolve(error),
      });
    });

    const request = httpTestingController.expectOne('https://third-party.example.com/profile');
    request.flush({}, { status: 401, statusText: 'Unauthorized' });

    const error = await errorPromise;
    expect(error.status).toBe(401);
    expect(refreshSpy).not.toHaveBeenCalled();
  });
});
