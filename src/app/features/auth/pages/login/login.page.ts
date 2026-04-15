import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent, CheckboxComponent, InputComponent } from '../../../../shared';
import { AuthStateService } from '../../../../core/auth/auth-state.service';

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
  private readonly authStateService = inject(AuthStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly submitted = signal(false);
  protected readonly hidePassword = signal(true);
  protected readonly loginError = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false],
  });

  constructor() {
    void this.redirectAuthenticatedUser();
  }

  protected async onSubmit(): Promise<void> {
    this.submitted.set(true);
    this.loginError.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    try {
      await this.authStateService.login(
        {
          email: this.loginForm.controls.email.value,
          password: this.loginForm.controls.password.value,
        },
        {
          persist: this.loginForm.controls.rememberMe.value,
        },
      );

      await this.router.navigateByUrl(this.getReturnUrl());
    } catch {
      this.loginError.set('Credenciais inválidas. Verifique seu email e senha.');
      this.loading.set(false);
    }
  }

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((current) => !current);
  }

  private async redirectAuthenticatedUser(): Promise<void> {
    if (await this.authStateService.ensureSessionValid()) {
      await this.router.navigateByUrl(this.getReturnUrl());
    }
  }

  private getReturnUrl(): string {
    return this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
  }
}
