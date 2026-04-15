import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { formatCpfValue, formatPhoneValue } from '../../../../../shared/forms/br-form.utils';

@Component({
  selector: 'app-step-personal',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './step-personal.component.html',
  styles: `
    .step-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 680px;
      width: 100%;
      min-width: 0;
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

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .col-span-full {
      grid-column: 1 / -1;
    }
    .tip-card {
      display: flex;
      gap: 1.5rem;
      align-items: center;
      padding: 1.25rem;
      margin-top: 1rem;
      background: #ffffff;
      border: 1px solid var(--color-outline);
      border-radius: 16px;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
    }
    .tip-icon-container {
      background-color: transparent;
      overflow: hidden;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 80px;
      height: 80px;
      background:
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.35), transparent 42%),
        linear-gradient(160deg, rgba(26, 35, 126, 0.96), rgba(15, 23, 42, 0.96));
    }
    .tip-content h4 {
      margin: 0 0 0.25rem 0;
      color: #1a237e;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.05em;
    }
    .tip-content p {
      margin: 0;
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    @media (max-width: 39.99rem) {
      .header-block .title {
        font-size: clamp(1.35rem, 6vw, 2rem);
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
      .tip-card {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepPersonalComponent {
  form = input.required<FormGroup>();

  onCpfInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const formattedValue = formatCpfValue(inputElement.value);
    this.form().get('cpf')?.setValue(formattedValue, { emitEvent: false });
    inputElement.value = formattedValue;
  }

  onPhoneInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const formattedValue = formatPhoneValue(inputElement.value);
    this.form().get('phone')?.setValue(formattedValue, { emitEvent: false });
    inputElement.value = formattedValue;
  }
}
