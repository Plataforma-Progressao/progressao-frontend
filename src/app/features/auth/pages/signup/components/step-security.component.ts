import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-step-security',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatCheckboxModule],
  template: `
    <div class="step-container" [formGroup]="form()">
      <div class="header-block">
        <h2 class="title">Quase lá, Professor.</h2>
        <p class="subtitle">Defina suas credenciais de acesso e revise os termos de uso para finalizar seu perfil de pesquisador.</p>
      </div>

      <div class="form-wrapper">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Senha de Acesso</mat-label>
            <input matInput [type]="hidePassword() ? 'password' : 'text'" formControlName="password" placeholder="••••••••" />
            <button mat-icon-button matSuffix (click)="togglePassword($event)" [attr.aria-label]="'Ocultar senha'" type="button">
              <mat-icon>{{hidePassword() ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            <mat-hint>Mínimo de 8 caracteres, incluindo letras e números.</mat-hint>
            @if (form().get('password')?.hasError('required') && form().get('password')?.touched) {
              <mat-error>A senha é obrigatória.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirmar Senha</mat-label>
            <input matInput [type]="hidePasswordConfirm() ? 'password' : 'text'" formControlName="confirmPassword" placeholder="••••••••" />
            <button mat-icon-button matSuffix (click)="togglePasswordConfirm($event)" [attr.aria-label]="'Ocultar senha'" type="button">
              <mat-icon>{{hidePasswordConfirm() ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
            @if (form().get('confirmPassword')?.hasError('required') && form().get('confirmPassword')?.touched) {
              <mat-error>A confirmação de senha é obrigatória.</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="checkbox-group">
          <mat-checkbox formControlName="acceptTerms" color="primary">
            Li e concordo com os <a href="#">Termos de Uso e Condições</a> da plataforma Digital Curator, incluindo as normas de ética em pesquisa institucional.
          </mat-checkbox>
          <mat-checkbox formControlName="acceptLgpd" color="primary">
            Autorizo o tratamento dos meus dados pessoais e profissionais conforme as diretrizes da <a href="#">LGPD (Lei Geral de Proteção de Dados)</a> para fins de curadoria e progresso na carreira acadêmica.
          </mat-checkbox>
        </div>
      </div>

      <div class="success-card">
        <div class="success-icon-bg">
          <mat-icon class="success-icon">stars</mat-icon>
        </div>
        <div class="success-text">
          <h4>Tudo pronto para sua jornada!</h4>
          <p>Ao finalizar, seu perfil será sincronizado com a base institucional e você terá acesso total ao seu novo dashboard.</p>
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

    .form-wrapper {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #F1F5F9;
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
      color: #1A237E;
      text-decoration: underline;
      font-weight: 500;
    }

    .success-card {
      display: flex;
      background-color: #F0FDF4;
      border-radius: 12px;
      padding: 1.25rem;
      gap: 1rem;
      align-items: flex-start;
    }
    .success-icon-bg {
      background: #A7F3D0;
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
      color: #065F46;
    }
    .success-text p {
      margin: 0;
      font-size: 0.75rem;
      color: #064E3B;
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
    this.hidePassword.update(v => !v);
    event.stopPropagation();
  }

  togglePasswordConfirm(event: MouseEvent) {
    this.hidePasswordConfirm.update(v => !v);
    event.stopPropagation();
  }
}
