import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  ButtonComponent,
  CheckboxComponent,
  InputComponent,
} from '../../../../shared';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    InputComponent,
    CheckboxComponent,
    ButtonComponent,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);

  protected readonly submitted = signal(false);
  protected readonly hidePassword = signal(true);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  protected onSubmit(): void {
    this.submitted.set(true);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // TODO: Integrar com serviço de autenticação.
  }

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((current) => !current);
  }
}
