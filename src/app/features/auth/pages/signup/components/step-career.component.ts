import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-step-career',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonToggleModule, MatIconModule],
  template: `
    <div class="step-layout" [formGroup]="form()">
      <div class="main-content">
        <h2 class="title">Perfil Profissional</h2>
        <p class="subtitle">Configure os detalhes da sua jornada acadêmica para que possamos curar as melhores oportunidades de progressão para sua carreira.</p>

        <div class="form-wrapper">
          <div class="form-grid">
            <mat-form-field appearance="outline" class="col-span-full">
              <mat-label>Área de Atuação</mat-label>
              <mat-select formControlName="practiceAreas" multiple>
                <mat-option value="ai">Inteligência Artificial</mat-option>
                <mat-option value="bio">Bioinformática</mat-option>
                <mat-option value="sys">Sistemas Distribuídos</mat-option>
                <mat-option value="data">Ciência de Dados</mat-option>
              </mat-select>
              <mat-icon matSuffix>school</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Classe de Carreira</mat-label>
              <mat-select formControlName="careerClass">
                <mat-option value="auxiliar">Auxiliar</mat-option>
                <mat-option value="assistente">Assistente</mat-option>
                <mat-option value="adjunto">Adjunto</mat-option>
                <mat-option value="associado">Associado</mat-option>
                <mat-option value="titular">Titular</mat-option>
              </mat-select>
              <mat-icon matSuffix>emoji_events</mat-icon>
            </mat-form-field>

            <div class="toggle-group-wrapper">
              <span class="input-label">Nível Atual</span>
              <mat-button-toggle-group formControlName="currentLevel" aria-label="Nível Atual" class="custom-toggle-group">
                <mat-button-toggle value="I">I</mat-button-toggle>
                <mat-button-toggle value="II">II</mat-button-toggle>
                <mat-button-toggle value="III">III</mat-button-toggle>
                <mat-button-toggle value="IV">IV</mat-button-toggle>
              </mat-button-toggle-group>
            </div>

            <mat-form-field appearance="outline" class="col-span-full">
              <mat-label>Data da última progressão</mat-label>
              <input matInput type="date" formControlName="lastProgressionDate" />
            </mat-form-field>
          </div>
        </div>
      </div>

      <div class="side-content">
        <div class="chart-card">
          <div class="chart-header">
            <mat-icon>trending_up</mat-icon>
            <h4>Previsão de Progressão</h4>
          </div>
          <div class="chart-placeholder">
             <div class="bar-container">
               <div class="bar bar-1"></div>
               <span class="year">2022</span>
             </div>
             <div class="bar-container">
               <div class="bar bar-2"></div>
               <span class="year">2023</span>
             </div>
             <div class="bar-container">
               <div class="bar bar-3">
                  <span class="goal-badge">Meta 2024</span>
               </div>
               <span class="year">2024</span>
             </div>
             <div class="bar-container">
               <div class="bar bar-4"></div>
               <span class="year">2025</span>
             </div>
          </div>
          <div class="chart-footer">
            <div class="success-icon-bg"><mat-icon class="success-icon">stars</mat-icon></div>
            <p>Você está no caminho certo para o nível <strong>Adjunto III</strong> em <br/><strong>Agosto de 2024</strong></p>
          </div>
        </div>

        <div class="curation-card">
          <h4>Curadoria de Carreira</h4>
          <p>Docentes da classe <strong>Adjunto II</strong> costumam focar em publicações em periódicos Q1 para acelerar a progressão para Associado.</p>
          <a href="#" class="link-action">Ver critérios de produtividade ↗</a>
        </div>
      </div>
    </div>
  `,
  styles: `
    .step-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 2rem;
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
      align-items: start;
    }
    .col-span-full {
      grid-column: 1 / -1;
    }
    
    .input-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #1E293B;
      margin-bottom: 0.5rem;
      display: block;
    }
    .toggle-group-wrapper {
      display: flex;
      flex-direction: column;
    }
    .custom-toggle-group {
      border: 1px solid #CBD5E1;
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
      background: #F8FAFC;
      border-radius: 16px;
      padding: 1.5rem;
    }
    .chart-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;
      color: #1A237E;
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
      border-bottom: 1px dashed #CBD5E1;
      padding-top: 2rem;
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
    .bar-1 { height: 30%; background: #E2E8F0; }
    .bar-2 { height: 60%; background: #94A3B8; }
    .bar-3 { height: 90%; background: #34D399; }
    .bar-4 { height: 95%; background: #E2E8F0; border: 1px dashed #CBD5E1; box-sizing: border-box; }
    
    .goal-badge {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      background: #065F46;
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
      color: #64748B;
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
      background: #D1FAE5;
      border-radius: 50%;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .success-icon {
      color: #10B981;
    }
    .chart-footer p {
      margin: 0;
      font-size: 0.8rem;
      color: #1E293B;
    }

    .curation-card {
      background: #283593;
      color: white;
      border-radius: 16px;
      padding: 1.5rem;
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
      color: #E0E7FF;
    }
    .link-action {
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
      text-decoration: none;
    }

    @media (max-width: 1023px) {
      .step-layout {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 639px) {
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
