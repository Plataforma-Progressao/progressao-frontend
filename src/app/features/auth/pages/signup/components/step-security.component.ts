import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-step-security',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './step-security.component.html',
  styles: `
    .step-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 680px;
    }
    .header-block .title {
      font-size: 2rem;
      font-weight: 800;
      color: #1a237e;
      margin: 0 0 0.5rem 0;
    }
    .header-block .subtitle {
      color: #4b5563;
      font-size: 1rem;
      margin: 0;
    }

    .form-wrapper {
      background: #ffffff;
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid var(--color-outline);
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .checkbox-group a {
      color: #1a237e;
      text-decoration: underline;
      font-weight: 500;
    }

    .success-card {
      display: flex;
      background-color: #ffffff;
      border: 1px solid var(--color-outline);
      border-radius: 16px;
      padding: 1.25rem;
      gap: 1rem;
      align-items: flex-start;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
    }
    .success-icon-bg {
      background: #a7f3d0;
      border-radius: 50%;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .success-icon {
      color: #059669;
    }
    .success-text h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      color: var(--color-primary);
    }
    .success-text p {
      margin: 0;
      font-size: 0.75rem;
      color: var(--color-text-secondary);
    }

    @media (max-width: 639px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepSecurityComponent {
  form = input.required<FormGroup>();

  hidePassword = signal(true);
  hidePasswordConfirm = signal(true);

  togglePassword(event: MouseEvent) {
    this.hidePassword.update((v) => !v);
    event.stopPropagation();
  }

  togglePasswordConfirm(event: MouseEvent) {
    this.hidePasswordConfirm.update((v) => !v);
    event.stopPropagation();
  }
}
