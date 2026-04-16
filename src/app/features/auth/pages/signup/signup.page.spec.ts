import { TestBed } from '@angular/core/testing';
import { MatStepper } from '@angular/material/stepper';
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

  it('uses app-button as the stepper action control', () => {
    const fixture = TestBed.createComponent(SignupPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.stepper-actions app-button').length).toBeGreaterThan(0);
    expect(compiled.querySelector('.stepper-actions [matStepperNext]')).toBeNull();
    expect(compiled.querySelector('.stepper-actions [matStepperPrevious]')).toBeNull();
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

  it('does not advance when current step form is invalid', () => {
    const fixture = TestBed.createComponent(SignupPage);
    const component = fixture.componentInstance;
    const stepperMock = { next: vi.fn(), previous: vi.fn() } as unknown as MatStepper;

    component.goToNextStep(stepperMock);

    expect(stepperMock.next).not.toHaveBeenCalled();
    expect(component.formGroups.personal.touched).toBe(true);
  });

  it('advances to next step when current step form is valid', () => {
    const fixture = TestBed.createComponent(SignupPage);
    const component = fixture.componentInstance;
    const stepperMock = { next: vi.fn(), previous: vi.fn() } as unknown as MatStepper;

    component.formGroups.personal.setValue({
      fullName: 'Ana Souza',
      cpf: '123.456.789-09',
      phone: '(31) 99999-0000',
      email: 'ana@universidade.br',
    });

    component.goToNextStep(stepperMock);

    expect(stepperMock.next).toHaveBeenCalledTimes(1);
  });

  it('goes back when previous action is triggered', () => {
    const fixture = TestBed.createComponent(SignupPage);
    const component = fixture.componentInstance;
    const stepperMock = { next: vi.fn(), previous: vi.fn() } as unknown as MatStepper;

    component.goToPreviousStep(stepperMock);

    expect(stepperMock.previous).toHaveBeenCalledTimes(1);
  });
});
