import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password-page',
  imports: [MatCardModule, RouterLink],
  templateUrl: './forgot-password.page.html',
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
      padding: max(1.5rem, env(safe-area-inset-top)) max(1.5rem, env(safe-area-inset-right))
        max(1.5rem, env(safe-area-inset-bottom)) max(1.5rem, env(safe-area-inset-left));
    }

    .placeholder-card {
      width: min(100%, 32rem);
      padding: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {}
