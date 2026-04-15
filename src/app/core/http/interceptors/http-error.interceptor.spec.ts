import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { NotificationService } from '../../notifications/notification.service';
import { httpErrorInterceptor } from './http-error.interceptor';
import { SKIP_ERROR_TOAST } from './http-error-context.tokens';

describe('httpErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpErrorInterceptor])),
        provideHttpClientTesting(),
        {
          provide: NotificationService,
          useValue: {
            error: vi.fn(),
          },
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('shows backend message in toast on request failure', async () => {
    const errorPromise = new Promise<HttpErrorResponse>((resolve) => {
      httpClient.get('http://localhost:3000/api/users/me').subscribe({
        error: (error: HttpErrorResponse) => resolve(error),
      });
    });

    const request = httpTestingController.expectOne('http://localhost:3000/api/users/me');
    request.flush({ message: 'Falha de validacao' }, { status: 400, statusText: 'Bad Request' });

    await errorPromise;
    expect(notificationService.error).toHaveBeenCalledWith('Falha de validacao');
  });

  it('does not show toast when request opts out with context token', async () => {
    const errorPromise = new Promise<HttpErrorResponse>((resolve) => {
      httpClient
        .get('http://localhost:3000/api/users/me', {
          context: new HttpContext().set(SKIP_ERROR_TOAST, true),
        })
        .subscribe({
          error: (error: HttpErrorResponse) => resolve(error),
        });
    });

    const request = httpTestingController.expectOne('http://localhost:3000/api/users/me');
    request.flush({}, { status: 500, statusText: 'Server Error' });

    await errorPromise;
    expect(notificationService.error).not.toHaveBeenCalled();
  });
});
