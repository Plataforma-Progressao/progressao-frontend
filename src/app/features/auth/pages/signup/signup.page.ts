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
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      cpf: ['', [Validators.required, cpfValidator()]],
      phone: ['', [phoneValidator()]],
      email: ['', [Validators.required, Validators.email]],
    }),
    institution: this.fb.nonNullable.group({
      university: ['', [Validators.required, Validators.minLength(2)]],
      center: ['', [Validators.required, Validators.minLength(2)]],
      department: ['', [Validators.required, Validators.minLength(2)]],
    }),
    career: this.fb.nonNullable.group({
      practiceAreas: [[] as string[], Validators.required],
      careerClass: ['', [Validators.required, Validators.minLength(2)]],
      currentLevel: ['', Validators.required],
      lastProgressionDate: ['', Validators.required],
    }),
    security: this.fb.nonNullable.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue],
        acceptLgpd: [false, Validators.requiredTrue],
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
