import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { AuthStateService } from '../../auth/auth-state.service';
import { AuthenticatedShellComponent } from './authenticated-shell.component';

describe('AuthenticatedShellComponent', () => {
  let fixture: ComponentFixture<AuthenticatedShellComponent>;
  let router: Router;

  const authStateServiceMock = {
    currentUser: vi.fn(() => ({
      id: '1',
      email: 'manuel.rocha@universidade.br',
      name: 'Dr. Manuel Rocha',
      role: 'USER' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: 'Prof. Associado IV',
      avatarInitials: 'MR',
    })),
    logout: vi.fn(() => new Promise<void>(() => undefined)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthenticatedShellComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthStateService,
          useValue: authStateServiceMock,
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    fixture = TestBed.createComponent(AuthenticatedShellComponent);
    fixture.detectChanges();
  });

  it('renders the protected shell chrome', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('app-authenticated-header')).toBeTruthy();
    expect(compiled.querySelector('app-authenticated-sidenav')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('navigates to login without waiting for remote logout', async () => {
    (fixture.componentInstance as any).logout();

    expect(authStateServiceMock.logout).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});
