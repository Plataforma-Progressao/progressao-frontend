import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { StepPersonalComponent } from './components/step-personal.component';
import { StepInstitutionComponent } from './components/step-institution.component';
import { StepCareerComponent } from './components/step-career.component';
import { StepSecurityComponent } from './components/step-security.component';

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
    StepSecurityComponent
  ],
  template: `
    <div class="page-layout">
      <!-- Main Header -->
      <header class="top-nav">
        <div class="logo">Plataforma Progressão</div>
        <div class="nav-actions">
          <a href="#">Ajuda</a>
          <a href="#">Segurança</a>
        </div>
      </header>

      <main class="content-wrapper">
        <div class="layout-grid">
          
          <div class="stepper-sidebar">
            <div class="sidebar-card">
              <h2 class="sidebar-title">Cadastro Docente</h2>
              <div class="sidebar-steps">
                <div class="step-item" [class.active]="currentStep() === 0" [class.completed]="currentStep() > 0">
                  <div class="step-icon">
                    @if (currentStep() > 0) { <mat-icon>check</mat-icon> } @else { <span>1</span> }
                  </div>
                  <div class="step-text">
                    <span class="step-overline">PASSO 1</span>
                    <span class="step-name">Pessoal</span>
                  </div>
                </div>
                <div class="step-item" [class.active]="currentStep() === 1" [class.completed]="currentStep() > 1">
                  <div class="step-icon">
                    @if (currentStep() > 1) { <mat-icon>check</mat-icon> } @else { <span>2</span> }
                  </div>
                  <div class="step-text">
                    <span class="step-overline">PASSO 2</span>
                    <span class="step-name">Instituição</span>
                  </div>
                </div>
                <div class="step-item" [class.active]="currentStep() === 2" [class.completed]="currentStep() > 2">
                  <div class="step-icon">
                    @if (currentStep() > 2) { <mat-icon>check</mat-icon> } @else { <span>3</span> }
                  </div>
                  <div class="step-text">
                    <span class="step-overline">PASSO 3</span>
                    <span class="step-name">Carreira</span>
                  </div>
                </div>
                <div class="step-item" [class.active]="currentStep() === 3" [class.completed]="currentStep() > 3">
                  <div class="step-icon">
                    @if (currentStep() > 3) { <mat-icon>lock</mat-icon> } @else { <mat-icon>lock</mat-icon> }
                  </div>
                  <div class="step-text">
                    <span class="step-overline">PASSO 4</span>
                    <span class="step-name">Segurança</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="support-card">
              <mat-icon>verified_user</mat-icon>
              <p>"A segurança dos seus dados acadêmicos é nossa prioridade. Utilizamos criptografia de ponta a ponta para proteger seu portfólio."</p>
              <span class="support-footer"><mat-icon inline>shield</mat-icon> PROTOCOLO DE CURADORIA DIGITAL</span>
            </div>
          </div>

          <div class="main-form-area">
             <!-- We use mat-stepper horizontally but hidden headers to utilize its logic 
                  or we can just use vertical stepper for mobile. Here we will use an invisible header stepper on desktop 
                  and link it to our custom sidebar, or just use css to hide stepper headers. -->
             <mat-stepper [linear]="true" #stepper class="custom-stepper" (selectionChange)="onStepChange($event)">
                
                <mat-step [stepControl]="formGroups.personal">
                   <app-step-personal [form]="formGroups.personal"></app-step-personal>
                   <div class="stepper-actions">
                      <button mat-button type="button" (click)="goToLogin()">Já é cadastrado? Fazer login</button>
                      <button mat-flat-button color="primary" matStepperNext [disabled]="formGroups.personal.invalid">Próximo Passo <mat-icon>arrow_forward</mat-icon></button>
                   </div>
                </mat-step>

                <mat-step [stepControl]="formGroups.institution">
                   <app-step-institution [form]="formGroups.institution"></app-step-institution>
                   <div class="stepper-actions">
                      <button mat-button matStepperPrevious type="button"><mat-icon>arrow_back</mat-icon> Voltar</button>
                      <button mat-flat-button color="primary" matStepperNext [disabled]="formGroups.institution.invalid">Próximo Passo <mat-icon>arrow_forward</mat-icon></button>
                   </div>
                </mat-step>

                <mat-step [stepControl]="formGroups.career">
                   <app-step-career [form]="formGroups.career"></app-step-career>
                   <div class="stepper-actions">
                      <button mat-button matStepperPrevious type="button"><mat-icon>arrow_back</mat-icon> Voltar</button>
                      <button mat-flat-button color="primary" matStepperNext [disabled]="formGroups.career.invalid">Próximo Passo <mat-icon>arrow_forward</mat-icon></button>
                   </div>
                </mat-step>

                <mat-step [stepControl]="formGroups.security">
                   <app-step-security [form]="formGroups.security"></app-step-security>
                   <div class="stepper-actions">
                      <button mat-button matStepperPrevious type="button"><mat-icon>arrow_back</mat-icon> Voltar</button>
                      <button mat-flat-button color="primary" (click)="submitForm()" [disabled]="formGroups.security.invalid">Finalizar e Acessar Dashboard <mat-icon>rocket_launch</mat-icon></button>
                   </div>
                </mat-step>

             </mat-stepper>
          </div>

        </div>
      </main>

      <footer class="bottom-footer">
        <span><mat-icon inline>check_circle</mat-icon> CONFORMIDADE CAPES</span>
        <span><mat-icon inline>lock</mat-icon> CRIPTOGRAFIA SSL 256-BIT</span>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background-color: #F9F9FB;
      font-family: 'Manrope', sans-serif;
    }

    .page-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .top-nav {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      background: white;
      border-bottom: 1px solid #E2E8F0;
    }
    .logo {
      font-weight: 700;
      color: #1A237E;
      font-size: 1.125rem;
    }
    .nav-actions {
      display: flex;
      gap: 1.5rem;
    }
    .nav-actions a {
      text-decoration: none;
      color: #1A237E;
      font-weight: 600;
      font-size: 0.875rem;
      border-bottom: 2px solid transparent;
      padding-bottom: 4px;
    }
    .nav-actions a:hover {
      border-bottom-color: #1A237E;
    }

    .content-wrapper {
      flex: 1;
      display: flex;
      justify-content: center;
      padding: 3rem 1.5rem;
    }

    .layout-grid {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 3rem;
      width: 100%;
      max-width: 1200px;
    }

    /* Sidebar Styles */
    .stepper-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .sidebar-card {
      background: #F8FAFC;
      border-radius: 16px;
      padding: 1.5rem;
    }
    .sidebar-title {
      font-size: 1.25rem;
      font-weight: 800;
      color: #1A237E;
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
    .step-item.active, .step-item.completed {
      opacity: 1;
    }
    
    .step-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #E2E8F0;
      color: #64748B;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      z-index: 2;
    }
    .step-item.active .step-icon {
      background: #1A237E;
      color: white;
    }
    .step-item.completed .step-icon {
      background: #10B981;
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
      color: #64748B;
    }
    .step-name {
      font-size: 1rem;
      font-weight: 700;
      color: #1E293B;
    }
    .step-item.active .step-name {
      color: #1A237E;
    }

    .support-card {
      background: #1A237E;
      color: white;
      border-radius: 12px;
      padding: 1.5rem;
    }
    .support-card p {
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 1rem 0;
      color: #E0E7FF;
    }
    .support-footer {
      font-size: 0.65rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #A5B4FC;
    }

    /* Main Form Area */
    .main-form-area {
      background: white;
      border-radius: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
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
      gap: 1rem;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid #E2E8F0;
    }
    .stepper-actions button {
      border-radius: 8px;
      padding: 0 1.5rem;
      height: 48px;
    }

    .bottom-footer {
      display: flex;
      justify-content: center;
      gap: 2rem;
      padding: 2rem;
      color: #94A3B8;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    @media (max-width: 1024px) {
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
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  currentStep = signal(0);

  formGroups = {
    personal: this.fb.group({
      fullName: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}$/)]],
      email: ['', [Validators.required, Validators.email]],
    }),
    institution: this.fb.group({
      university: ['', Validators.required],
      center: ['', Validators.required],
      department: ['', Validators.required],
    }),
    career: this.fb.group({
      practiceAreas: [[], Validators.required],
      careerClass: ['', Validators.required],
      currentLevel: ['', Validators.required],
      lastProgressionDate: ['', Validators.required],
    }),
    security: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      acceptLgpd: [false, Validators.requiredTrue],
    }),
  };

  onStepChange(event: any) {
    this.currentStep.set(event.selectedIndex);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  submitForm() {
    if (
      this.formGroups.personal.valid &&
      this.formGroups.institution.valid &&
      this.formGroups.career.valid &&
      this.formGroups.security.valid
    ) {
      const formData = {
        ...this.formGroups.personal.value,
        ...this.formGroups.institution.value,
        ...this.formGroups.career.value,
        ...this.formGroups.security.value,
      };
      console.log('Registration submitted:', formData);
      // Aqui faria a requisição para o backend
      // alert('Cadastro realizado com sucesso!');
      this.router.navigate(['/']);
    }
  }
}
