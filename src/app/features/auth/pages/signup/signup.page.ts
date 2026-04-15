import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
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

@Component({
  selector: 'app-signup-page',
  imports: [
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    StepPersonalComponent,
    StepInstitutionComponent,
    StepCareerComponent,
    StepSecurityComponent,
  ],
  templateUrl: './signup.page.html',
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background-color: #f9f9fb;
      font-family: 'Manrope', sans-serif;
    }

    .page-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .top-nav {
      min-height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: max(0.5rem, env(safe-area-inset-top)) clamp(0.75rem, 4vw, 2rem) 0.5rem;
      background: white;
      border-bottom: 1px solid #e2e8f0;
    }
    .logo {
      font-weight: 700;
      color: #1a237e;
      font-size: 1.125rem;
    }
    .nav-actions {
      display: flex;
      gap: 1.5rem;
    }
    .nav-actions a {
      text-decoration: none;
      color: #1a237e;
      font-weight: 600;
      font-size: 0.875rem;
      border-bottom: 2px solid transparent;
      padding-bottom: 4px;
    }
    .nav-actions a:hover {
      border-bottom-color: #1a237e;
    }

    .content-wrapper {
      flex: 1;
      display: flex;
      justify-content: center;
      padding: clamp(1rem, 5vw, 3rem) clamp(0.75rem, 4vw, 1.5rem);
      padding-bottom: max(clamp(1rem, 5vw, 3rem), env(safe-area-inset-bottom));
    }

    .layout-grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: clamp(1.25rem, 4vw, 3rem);
      width: 100%;
      max-width: 1200px;
      min-width: 0;
    }

    .main-form-area {
      min-width: 0;
    }

    /* Sidebar Styles */
    .stepper-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .sidebar-card {
      background: #f8fafc;
      border-radius: 16px;
      padding: 1.5rem;
    }
    .sidebar-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #1a237e;
      margin: 0 0 1.5rem 0;
    }
    .sidebar-steps {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      position: relative;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      opacity: 0.5;
      transition: opacity 0.3s ease;
      position: relative;
    }
    .step-item.active,
    .step-item.completed {
      opacity: 1;
    }

    .step-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #64748b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      z-index: 2;
    }
    .step-item.active .step-icon {
      background: #1a237e;
      color: white;
    }
    .step-item.completed .step-icon {
      background: #10b981;
      color: white;
    }
    .step-item.completed:not(.active) .step-icon mat-icon {
      font-size: 18px;
    }

    .step-text {
      display: flex;
      flex-direction: column;
    }
    .step-overline {
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
    }
    .step-name {
      font-size: 1rem;
      font-weight: 700;
      color: #1e293b;
    }
    .step-item.active .step-name {
      color: #1a237e;
    }

    .support-card {
      background: #1a237e;
      color: white;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .support-card p {
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 1rem 0;
      color: #e0e7ff;
    }
    .support-footer {
      font-size: 0.65rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #a5b4fc;
    }

    /* Main Form Area */
    .main-form-area {
      background-color: #fff;
      border-radius: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
      padding: 2.5rem;
      position: relative;
    }

    /* Hide Stepper Headers globally via ng-deep to replace with custom sidebar */
    ::ng-deep .custom-stepper .mat-horizontal-stepper-header-container {
      display: none !important;
    }

    .stepper-actions {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }
    .stepper-actions button {
      border-radius: 8px;
      padding: 0 1.5rem;
      height: 48px;
    }

    .signup-error {
      background: rgb(239 68 68 / 10%);
      border: 1px solid rgb(239 68 68 / 16%);
      border-radius: 0.75rem;
      color: #b91c1c;
      font-size: 0.9rem;
      font-weight: 600;
      margin: 1.25rem 0 0;
      padding: 0.75rem 0.9rem;
    }

    .bottom-footer {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem 2rem;
      padding: max(1.25rem, env(safe-area-inset-bottom)) clamp(1rem, 4vw, 2rem);
      color: #94a3b8;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-align: center;
    }

    @media (max-width: 63.99rem) {
      .layout-grid {
        grid-template-columns: 1fr;
      }
      .stepper-sidebar {
        display: none;
      }
      ::ng-deep .custom-stepper .mat-horizontal-stepper-header-container {
        display: flex !important;
        margin-bottom: 2rem;
      }
    }

    @media (max-width: 39.99rem) {
      .stepper-actions {
        flex-direction: column-reverse;
        align-items: stretch;
      }
      .stepper-actions button {
        width: 100%;
      }
    }
  `,
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

  submitForm(): void {
    void this.submitRegistration();
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
