import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { DashboardShellComponent } from './dashboard-shell.component';
import { AuthStateService } from '../../../../core/auth/auth-state.service';

describe('DashboardShellComponent', () => {
  let fixture: ComponentFixture<DashboardShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardShellComponent],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const authStateService = TestBed.inject(AuthStateService);
    const httpTestingController = TestBed.inject(HttpTestingController);

    const loginPromise = authStateService.login({
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

    fixture = TestBed.createComponent(DashboardShellComponent);
    fixture.detectChanges();
  });

  it('renders the protected shell chrome', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-dashboard-header')).toBeTruthy();
    expect(compiled.querySelector('app-dashboard-sidenav')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
