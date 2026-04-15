import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-step-career',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonToggleModule,
    MatIconModule,
  ],
  templateUrl: './step-career.component.html',
  styles: `
    .step-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 2rem;
      min-width: 0;
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
      align-items: start;
    }
    .col-span-full {
      grid-column: 1 / -1;
    }

    .input-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.5rem;
      display: block;
    }
    .toggle-group-wrapper {
      display: flex;
      flex-direction: column;
    }
    .custom-toggle-group {
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      box-shadow: none;
      width: 100%;
      height: 56px;
    }
    .custom-toggle-group mat-button-toggle {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .side-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .chart-card {
      background: #ffffff;
      border: 1px solid var(--color-outline);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
    }
    .chart-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      color: #1a237e;
    }
    .chart-header h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
    }

    .chart-placeholder {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 140px;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px dashed #cbd5e1;
      padding-top: 2rem;
      background: #f8fafc;
      border-radius: 12px;
      padding-inline: 1rem;
    }
    .bar-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      width: 40px;
      height: 100%;
      justify-content: flex-end;
    }
    .bar {
      width: 100%;
      border-radius: 4px 4px 0 0;
      position: relative;
    }
    .bar-1 {
      height: 30%;
      background: #e2e8f0;
    }
    .bar-2 {
      height: 60%;
      background: #94a3b8;
    }
    .bar-3 {
      height: 90%;
      background: #34d399;
    }
    .bar-4 {
      height: 95%;
      background: #e2e8f0;
      border: 1px dashed #cbd5e1;
      box-sizing: border-box;
    }

    .goal-badge {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      background: #065f46;
      color: white;
      font-size: 0.5rem;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
      font-weight: 600;
      z-index: 10;
    }
    .year {
      font-size: 0.65rem;
      color: #64748b;
      font-weight: 600;
    }
    .chart-footer {
      display: flex;
      gap: 1rem;
      align-items: center;
      background: white;
      padding: 1rem;
      border-radius: 12px;
    }
    .success-icon-bg {
      background: #d1fae5;
      border-radius: 50%;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .success-icon {
      color: #10b981;
    }
    .chart-footer p {
      margin: 0;
      font-size: 0.8rem;
      color: #1e293b;
    }

    .curation-card {
      background: #ffffff;
      color: var(--color-text-primary);
      border-radius: 16px;
      padding: 1.5rem;
      border: 1px solid var(--color-outline);
      box-shadow: 0 12px 32px rgba(15, 23, 42, 0.05);
    }
    .curation-card h4 {
      margin: 0 0 0.75rem 0;
      font-size: 1rem;
      font-weight: 600;
    }
    .curation-card p {
      margin: 0 0 1rem 0;
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--color-text-secondary);
    }
    .link-action {
      color: var(--color-primary);
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
    }

    @media (max-width: 63.99rem) {
      .step-layout {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 39.99rem) {
      .title {
        font-size: clamp(1.35rem, 6vw, 2rem);
      }
      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepCareerComponent {
  form = input.required<FormGroup>();
}
