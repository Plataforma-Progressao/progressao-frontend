import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-step-institution',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './step-institution.component.html',
  styles: `
    .step-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
    }

    .overline {
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .title {
      font-size: 2rem;
      font-weight: 800;
      color: #1a237e;
      margin-top: 0;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #4b5563;
      margin-bottom: 2rem;
      font-size: 1rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .col-span-full {
      grid-column: 1 / -1;
    }

    .validation-card {
      display: flex;
      background-color: #ffffff;
      border: 1px solid var(--color-outline);
      border-radius: 16px;
      padding: 1.25rem;
      gap: 1rem;
      align-items: flex-start;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
    }
    .success-icon {
      color: #10b981;
    }
    .validation-text h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      color: #1e293b;
    }
    .validation-text p {
      margin: 0;
      font-size: 0.75rem;
      color: #64748b;
    }

    .side-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .image-card {
      background: #ffffff;
      border: 1px solid var(--color-outline);
      border-radius: 16px;
      padding: 1rem;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
    }

    .image-overlay {
      min-height: 180px;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 0.5rem;
      color: white;
      background:
        radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 38%),
        linear-gradient(160deg, rgba(26, 35, 126, 0.84), rgba(15, 23, 42, 0.94));
    }

    .image-card .badge {
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      background: rgba(255, 255, 255, 0.2);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
      margin-bottom: 0.5rem;
    }
    .image-card h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      line-height: 1.4;
    }

    .stats-card {
      background: #ffffff;
      border: 1px solid var(--color-outline);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
    }
    .stats-card h2 {
      margin: 0;
      color: #10b981;
      font-size: 3rem;
      font-weight: 800;
      line-height: 1;
    }
    .stats-title {
      display: block;
      font-size: 0.65rem;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.1em;
      margin-bottom: 0.75rem;
      margin-top: 0.25rem;
    }
    .stats-card p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      line-height: 1.5;
    }

    @media (max-width: 1023px) {
      .step-layout {
        grid-template-columns: 1fr;
      }
      .side-content {
        flex-direction: row;
      }
      .image-card,
      .stats-card {
        flex: 1;
      }
    }
    @media (max-width: 639px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      .side-content {
        flex-direction: column;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepInstitutionComponent {
  form = input.required<FormGroup>();
}
