import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-step-institution',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  template: `
    <div class="step-layout" [formGroup]="form()">
      <div class="main-content">
        <h5 class="overline">ETAPA 02 DE 04</h5>
        <h2 class="title">Onde você atua hoje?</h2>
        <p class="subtitle">Vincule seu perfil à sua unidade acadêmica para habilitar as ferramentas de progressão docente.</p>

        <div class="form-grid">
          <mat-form-field appearance="outline" class="col-span-full">
            <mat-label>Selecione a instituição</mat-label>
            <mat-select formControlName="university">
              <mat-option value="ufmg">Universidade Federal de Minas Gerais (UFMG)</mat-option>
              <mat-option value="ufrj">Universidade Federal do Rio de Janeiro (UFRJ)</mat-option>
              <mat-option value="unifesp">Universidade Federal de São Paulo (UNIFESP)</mat-option>
              <mat-option value="ufsc">Universidade Federal de Santa Catarina (UFSC)</mat-option>
            </mat-select>
            <mat-icon matSuffix>account_balance</mat-icon>
            @if (form().get('university')?.hasError('required') && form().get('university')?.touched) {
              <mat-error>A instituição é obrigatória.</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Escolha o Centro</mat-label>
            <mat-select formControlName="center">
              <mat-option value="icex">Instituto de Ciências Exatas</mat-option>
              <mat-option value="face">Faculdade de Economia</mat-option>
              <mat-option value="letras">Faculdade de Letras</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Selecione o Depto.</mat-label>
            <mat-select formControlName="department">
              <mat-option value="dcc">Dep. Ciência da Computação</mat-option>
              <mat-option value="dmat">Dep. de Matemática</mat-option>
              <mat-option value="dfis">Dep. de Física</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="validation-card">
          <mat-icon class="success-icon">verified_user</mat-icon>
          <div class="validation-text">
            <h4>Validado automaticamente</h4>
            <p>Ao selecionar uma instituição federativa, seus dados serão pré-validados com a base do MEC e do portal da transparência.</p>
          </div>
        </div>
      </div>

      <div class="side-content">
        <div class="image-card">
          <div class="image-overlay">
            <span class="badge">EXCELÊNCIA</span>
            <h3>Sua carreira conectada à rede federal.</h3>
          </div>
        </div>
        <div class="stats-card">
          <h2>94%</h2>
          <span class="stats-title">SINCRONIZAÇÃO</span>
          <p>Docentes que vinculam sua instituição reduzem o tempo de preenchimento do Barema em até 40%.</p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .step-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 2rem;
    }
    
    .overline {
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      color: #64748B;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    .title {
      font-size: 2rem;
      font-weight: 800;
      color: #1A237E;
      margin-top: 0;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #4B5563;
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
      background-color: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 1.25rem;
      gap: 1rem;
      align-items: flex-start;
    }
    .success-icon {
      color: #10B981;
    }
    .validation-text h4 {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      color: #1E293B;
    }
    .validation-text p {
      margin: 0;
      font-size: 0.75rem;
      color: #64748B;
    }

    .side-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .image-card {
      background: linear-gradient(to bottom, rgba(26, 35, 126, 0.2), rgba(26, 35, 126, 0.9)), url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80') center/cover;
      height: 240px;
      border-radius: 16px;
      position: relative;
    }
    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1.5rem;
      color: white;
    }
    .image-card .badge {
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      background: rgba(255,255,255,0.2);
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
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .stats-card h2 {
      margin: 0;
      color: #10B981;
      font-size: 3rem;
      font-weight: 800;
      line-height: 1;
    }
    .stats-title {
      display: block;
      font-size: 0.65rem;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 0.1em;
      margin-bottom: 0.75rem;
      margin-top: 0.25rem;
    }
    .stats-card p {
      margin: 0;
      font-size: 0.875rem;
      color: #4B5563;
      line-height: 1.5;
    }

    @media (max-width: 1023px) {
      .step-layout {
        grid-template-columns: 1fr;
      }
      .side-content {
        flex-direction: row;
      }
      .image-card, .stats-card {
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
