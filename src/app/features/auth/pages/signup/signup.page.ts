import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

import { StepPersonalComponent } from './components/step-personal.component';
import { StepInstitutionComponent } from './components/step-institution.component';
import { StepCareerComponent } from './components/step-career.component';
import { StepSecurityComponent } from './components/step-security.component';
import {
  cpfValidator,
  passwordMatchValidator,
  phoneValidator,
} from '../../../../shared/forms/br-form.utils';
import { AuthStateService } from '../../../../core/auth/auth-state.service';
import { AuthPageFooterComponent } from '../../components/auth-page-footer/auth-page-footer.component';
import { AuthPageHeaderComponent } from '../../components/auth-page-header/auth-page-header.component';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';

const DEFAULT_SIGNUP_FORM_VALUES = {
  personal: {
    fullName: 'Dra. Ana Souza',
    cpf: '123.456.789-09',
    phone: '(31) 99999-0000',
    email: 'ana.souza@universidade.br',
  },
  institution: {
    university: 'ufmg',
    center: 'icex',
    department: 'dcc',
  },
  career: {
    practiceAreas: ['data', 'sys'],
    careerClass: 'adjunto',
    currentLevel: 'III',
    lastProgressionDate: '2024-08-15',
  },
  security: {
    password: 'Progressao@123',
    confirmPassword: 'Progressao@123',
    acceptTerms: true,
    acceptLgpd: true,
  },
};

@Component({
  selector: 'app-signup-page',
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatIconModule,
    ButtonComponent,
    StepPersonalComponent,
    StepInstitutionComponent,
    StepCareerComponent,
    StepSecurityComponent,
    AuthPageHeaderComponent,
    AuthPageFooterComponent,
  ],
  templateUrl: './signup.page.html',
  styleUrl: './signup.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authStateService = inject(AuthStateService);

  protected readonly currentStep = signal(0);
  protected readonly submitError = signal<string | null>(null);
  protected readonly submitting = signal(false);

  formGroups = {
    personal: this.fb.nonNullable.group({
      fullName: [
        DEFAULT_SIGNUP_FORM_VALUES.personal.fullName,
        [Validators.required, Validators.minLength(2)],
      ],
      cpf: [DEFAULT_SIGNUP_FORM_VALUES.personal.cpf, [Validators.required, cpfValidator()]],
      phone: [DEFAULT_SIGNUP_FORM_VALUES.personal.phone, [phoneValidator()]],
      email: [DEFAULT_SIGNUP_FORM_VALUES.personal.email, [Validators.required, Validators.email]],
    }),
    institution: this.fb.nonNullable.group({
      university: [
        DEFAULT_SIGNUP_FORM_VALUES.institution.university,
        [Validators.required, Validators.minLength(2)],
      ],
      center: [
        DEFAULT_SIGNUP_FORM_VALUES.institution.center,
        [Validators.required, Validators.minLength(2)],
      ],
      department: [
        DEFAULT_SIGNUP_FORM_VALUES.institution.department,
        [Validators.required, Validators.minLength(2)],
      ],
    }),
    career: this.fb.nonNullable.group({
      practiceAreas: [DEFAULT_SIGNUP_FORM_VALUES.career.practiceAreas, Validators.required],
      careerClass: [
        DEFAULT_SIGNUP_FORM_VALUES.career.careerClass,
        [Validators.required, Validators.minLength(2)],
      ],
      currentLevel: [DEFAULT_SIGNUP_FORM_VALUES.career.currentLevel, Validators.required],
      lastProgressionDate: [
        DEFAULT_SIGNUP_FORM_VALUES.career.lastProgressionDate,
        Validators.required,
      ],
    }),
    security: this.fb.nonNullable.group(
      {
        password: [
          DEFAULT_SIGNUP_FORM_VALUES.security.password,
          [Validators.required, Validators.minLength(8)],
        ],
        confirmPassword: [DEFAULT_SIGNUP_FORM_VALUES.security.confirmPassword, Validators.required],
        acceptTerms: [DEFAULT_SIGNUP_FORM_VALUES.security.acceptTerms, Validators.requiredTrue],
        acceptLgpd: [DEFAULT_SIGNUP_FORM_VALUES.security.acceptLgpd, Validators.requiredTrue],
      },
      { validators: [passwordMatchValidator()] },
    ),
  };

  onStepChange(event: StepperSelectionEvent): void {
    this.currentStep.set(event.selectedIndex);
  }

  goToLogin(): void {
    void this.router.navigate(['/login']);
  }

  goToPreviousStep(stepper: MatStepper): void {
    stepper.previous();
  }

  goToNextStep(stepper: MatStepper): void {
    const stepIndex = this.currentStep();

    if (stepIndex === 0 && this.formGroups.personal.valid) {
      stepper.next();
      return;
    }

    if (stepIndex === 1 && this.formGroups.institution.valid) {
      stepper.next();
      return;
    }

    if (stepIndex === 2 && this.formGroups.career.valid) {
      stepper.next();
      return;
    }

    this.markCurrentStepAsTouched(stepIndex);
  }

  submitForm(): void {
    void this.submitRegistration();
  }

  private markCurrentStepAsTouched(stepIndex: number): void {
    if (stepIndex === 0) {
      this.formGroups.personal.markAllAsTouched();
      return;
    }

    if (stepIndex === 1) {
      this.formGroups.institution.markAllAsTouched();
      return;
    }

    if (stepIndex === 2) {
      this.formGroups.career.markAllAsTouched();
    }
  }

  private async submitRegistration(): Promise<void> {
    if (
      this.formGroups.personal.valid &&
      this.formGroups.institution.valid &&
      this.formGroups.career.valid &&
      this.formGroups.security.valid
    ) {
      this.submitError.set(null);
      this.submitting.set(true);

      const personalData = this.formGroups.personal.getRawValue();
      const institutionData = this.formGroups.institution.getRawValue();
      const careerData = this.formGroups.career.getRawValue();
      const securityData = this.formGroups.security.getRawValue();

      const registerPayload = {
        fullName: personalData.fullName,
        cpf: personalData.cpf,
        email: personalData.email,
        ...institutionData,
        ...careerData,
        ...securityData,
        lastProgressionDate: String(careerData.lastProgressionDate),
      };

      try {
        await this.authStateService.register(registerPayload, { persist: true });
        await this.router.navigate(['/dashboard']);
      } catch {
        this.submitError.set(
          'Não foi possível concluir o cadastro agora. Verifique os dados e tente novamente.',
        );
      } finally {
        this.submitting.set(false);
      }
      return;
    }

    this.formGroups.personal.markAllAsTouched();
    this.formGroups.institution.markAllAsTouched();
    this.formGroups.career.markAllAsTouched();
    this.formGroups.security.markAllAsTouched();
  }
}
