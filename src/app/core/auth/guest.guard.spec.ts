import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { guestGuard } from './guest.guard';
import { AuthStateService } from './auth-state.service';

describe('guestGuard', () => {
  it('should allow guests to access auth routes', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthStateService,
          useValue: {
            ensureSessionValid: vi.fn().mockResolvedValue(false),
          },
        },
      ],
    });

    const result = await TestBed.runInInjectionContext(() => guestGuard({} as never, []));

    expect(result).toBe(true);
  });

  it('should redirect authenticated users to dashboard', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: AuthStateService,
          useValue: {
            ensureSessionValid: vi.fn().mockResolvedValue(true),
          },
        },
      ],
    });

    const result = await TestBed.runInInjectionContext(() => guestGuard({} as never, []));

    const router = TestBed.inject(Router);
    expect(router.serializeUrl(result as never)).toContain('/dashboard');
  });
});
