import { TestBed } from '@angular/core/testing';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { SignupPage } from './signup.page';
import { AuthStateService } from '../../../../core/auth/auth-state.service';

describe('SignupPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupPage],
      providers: [
        provideRouter([]),
        {
          provide: AuthStateService,
          useValue: {
            register: vi.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the registration cards with a white background', () => {
    const fixture = TestBed.createComponent(SignupPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const sidebarCard = compiled.querySelector('.sidebar-card');
    const supportCard = compiled.querySelector('.support-card');

    expect(sidebarCard).toBeTruthy();
    expect(supportCard).toBeTruthy();
    expect(getComputedStyle(sidebarCard as Element).backgroundColor).toBe('rgb(248, 250, 252)');
    expect(getComputedStyle(supportCard as Element).backgroundColor).toBe('rgb(26, 35, 126)');
  });

  it('renders the sidebar steps and syncs the current step when the stepper changes', () => {
    const fixture = TestBed.createComponent(SignupPage);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.step-item').length).toBe(4);
    expect(compiled.querySelector('.step-item.active')).toBeTruthy();

    component.onStepChange({
      selectedIndex: 2,
      previouslySelectedIndex: 1,
      selectedStep: {} as never,
      previouslySelectedStep: {} as never,
    } as StepperSelectionEvent);
    fixture.detectChanges();

    expect(component['currentStep']()).toBe(2);
    expect(compiled.querySelectorAll('.step-item')[0]?.classList.contains('completed')).toBe(true);
    expect(compiled.querySelectorAll('.step-item')[2]?.classList.contains('active')).toBe(true);
  });
});
