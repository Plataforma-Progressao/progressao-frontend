import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  imports: [MatCardModule, RouterLink],
  template: `
    <main class="placeholder-wrapper">
      <mat-card appearance="outlined" class="placeholder-card">
        <h1>Recuperar senha</h1>
        <p>Fluxo de recuperacao de senha em construcao.</p>
        <a routerLink="/login">Voltar para login</a>
      </mat-card>
    </main>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
      background: #f9f9fb;
    }

    .placeholder-wrapper {
      min-height: 100dvh;
      display: grid;
      place-items: center;
      padding: 1.5rem;
    }

    .placeholder-card {
      width: min(100%, 32rem);
      padding: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {}
