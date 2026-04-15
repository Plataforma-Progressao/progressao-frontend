import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { authHeaderInterceptor } from './auth-header.interceptor';
import { AuthStateService } from '../auth-state.service';

describe('authHeaderInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authHeaderInterceptor])),
        provideHttpClientTesting(),
        {
          provide: AuthStateService,
          useValue: {
            getAccessToken: () => 'access-token',
          },
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should append Authorization header for backend API requests', () => {
    httpClient.get('http://localhost:3000/api/users/me').subscribe();

    const request = httpTestingController.expectOne('http://localhost:3000/api/users/me');
    expect(request.request.headers.get('Authorization')).toBe('Bearer access-token');
    request.flush({ success: true, data: {} });
  });

  it('should skip non-backend requests', () => {
    httpClient.get('https://third-party.example.com/profile').subscribe();

    const request = httpTestingController.expectOne('https://third-party.example.com/profile');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});
