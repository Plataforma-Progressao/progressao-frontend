import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { ButtonComponent, InputComponent } from '../../../../shared';
import { AuthStateService } from '../../../../core/auth/auth-state.service';
import { AuthPageFooterComponent } from '../../components/auth-page-footer/auth-page-footer.component';
import { AuthPageHeaderComponent } from '../../components/auth-page-header/auth-page-header.component';

@Component({
  selector: 'app-forgot-password-page',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    InputComponent,
    ButtonComponent,
    AuthPageHeaderComponent,
    AuthPageFooterComponent,
  ],
  templateUrl: './forgot-password.page.html',
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
      background: #f9f9fb;
    }

    .page-layout {
      display: flex;
      flex-direction: column;
      min-height: 100dvh;
    }

    .content-wrapper {
      align-items: center;
      display: flex;
      flex: 1;
      justify-content: center;
      padding: clamp(1rem, 5vw, 3rem) clamp(0.75rem, 4vw, 1.5rem);
    }

    .recovery-card {
      border-radius: 1.25rem;
      padding: clamp(1.25rem, 2vw, 2rem);
      width: min(100%, 34rem);
    }

    .card-header h1 {
      color: #0f172a;
      font-size: clamp(1.4rem, 2.1vw, 1.8rem);
      margin: 0;
    }

    .card-header p {
      color: #475569;
      margin: 0.625rem 0 0;
    }

    .recovery-form {
      display: grid;
      gap: 1.25rem;
      margin-top: 1.5rem;
    }

    .feedback {
      background: rgb(22 163 74 / 10%);
      border: 1px solid rgb(22 163 74 / 16%);
      border-radius: 0.75rem;
      color: #166534;
      font-size: 0.9rem;
      font-weight: 600;
      margin: 0;
      padding: 0.75rem 0.9rem;
    }

    .feedback--error {
      background: rgb(239 68 68 / 10%);
      border-color: rgb(239 68 68 / 16%);
      color: #b91c1c;
    }

    .actions {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: 1fr 1fr;
    }

    .helper {
      color: #64748b;
      font-size: 0.875rem;
      margin: 0;
      text-align: center;
    }

    @media (max-width: 39.99rem) {
      .actions {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authStateService = inject(AuthStateService);

  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly feedback = signal<{ type: 'success' | 'error'; message: string } | null>(null);

  protected readonly forgotPasswordForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected async onSubmit(): Promise<void> {
    this.submitted.set(true);
    this.feedback.set(null);

    if (this.forgotPasswordForm.invalid) {
      this.forgotPasswordForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    try {
      const response = await this.authStateService.forgotPassword(
        this.forgotPasswordForm.controls.email.value,
      );
      this.feedback.set({
        type: 'success',
        message: response.message,
      });
    } catch {
      this.feedback.set({
        type: 'error',
        message: 'Não foi possível processar sua solicitação agora. Tente novamente em instantes.',
      });
    } finally {
      this.submitting.set(false);
    }
  }

  protected goToLogin(): void {
    void this.router.navigate(['/login']);
  }
}
