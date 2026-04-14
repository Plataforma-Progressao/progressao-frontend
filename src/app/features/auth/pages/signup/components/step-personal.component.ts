import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-step-personal',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <div class="step-container" [formGroup]="form()">
      <div class="header-block">
        <h2 class="title">Dados Pessoais</h2>
        <p class="subtitle">Inicie seu processo de curadoria informando os dados fundamentais para sua identificação no sistema.</p>
      </div>

      <div class="form-grid">
        <mat-form-field appearance="fill" class="col-span-full">
          <mat-label>Nome completo</mat-label>
          <input matInput formControlName="fullName" placeholder="Ex: Dr. Manuel Rocha" />
          <mat-icon matSuffix>badge</mat-icon>
          @if (form().get('fullName')?.hasError('required') && form().get('fullName')?.touched) {
            <mat-error>O nome completo é obrigatório.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>CPF</mat-label>
          <input matInput formControlName="cpf" placeholder="000.000.000-00" />
          <mat-icon matSuffix>123</mat-icon>
          @if (form().get('cpf')?.hasError('required') && form().get('cpf')?.touched) {
            <mat-error>O CPF é obrigatório.</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>E-mail institucional</mat-label>
          <input matInput formControlName="email" type="email" placeholder="nome@universidade.edu" />
          <mat-icon matSuffix>alternate_email</mat-icon>
          @if (form().get('email')?.hasError('required') && form().get('email')?.touched) {
            <mat-error>O e-mail é obrigatório.</mat-error>
          }
          @if (form().get('email')?.hasError('email') && form().get('email')?.touched) {
            <mat-error>E-mail inválido.</mat-error>
          }
        </mat-form-field>
      </div>

      <div class="tip-card">
        <div class="tip-icon-container">
          <mat-icon style="color: white; transform: scale(1.3)">edit_calendar</mat-icon>
        </div>
        <div class="tip-content">
          <h4>DICA CURATORIAL</h4>
          <p>Certifique-se de que o seu e-mail institucional está ativo. Todas as notificações de progresso de carreira e relatórios anuais serão enviados para este endereço.</p>
        </div>
      </div>
    </div>
  `,
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
      color: #1A237E;
      margin: 0 0 0.5rem 0;
    }
    .header-block .subtitle {
      color: #4B5563;
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
      padding: 0;
      margin-top: 1rem;
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
      background: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1455390582262-044cdead27d1?auto=format&fit=crop&w=150&q=80') center/cover;
    }
    .tip-content h4 {
      margin: 0 0 0.25rem 0;
      color: #1A237E;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.05em;
    }
    .tip-content p {
      margin: 0;
      color: #4B5563;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    @media (max-width: 639px) {
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
}
