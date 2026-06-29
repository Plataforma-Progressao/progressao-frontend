import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { AdminApiService } from '../../admin-api.service';
import { AuthRole } from '../../../../core/auth/auth.models';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { CheckboxComponent } from '../../../../shared/components/base/checkbox/checkbox.component';
import { InputComponent } from '../../../../shared/components/base/input/input.component';
import { NotificationService } from '../../../../core/notifications/notification.service';

@Component({
  selector: 'app-admin-user-create-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatIconModule,
    ButtonComponent,
    CheckboxComponent,
    InputComponent,
  ],
  templateUrl: './usuario-novo.page.html',
  styleUrl: './usuario-novo.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly adminApi = inject(AdminApiService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  protected readonly saving = signal(false);

  protected cancel(): void {
    void this.router.navigate(['/admin/usuarios']);
  }

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    roleUser: [true],
    roleEvaluator: [false],
    university: [''],
    department: [''],
    careerClass: [''],
    currentLevel: [''],
    lastProgressionDate: [''],
  });

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const roles: AuthRole[] = [];
    if (value.roleUser) roles.push('USER');
    if (value.roleEvaluator) roles.push('EVALUATOR');

    if (roles.length === 0) {
      this.notificationService.error('Selecione ao menos um papel.');
      return;
    }

    this.saving.set(true);
    this.adminApi
      .createUser({
        name: value.name.trim(),
        email: value.email.trim(),
        password: value.password,
        roles,
        university: value.university.trim() || undefined,
        department: value.department.trim() || undefined,
        careerClass: value.careerClass.trim() || undefined,
        currentLevel: value.currentLevel.trim() || undefined,
        lastProgressionDate: value.lastProgressionDate || undefined,
      })
      .pipe(
        tap(() => {
          this.notificationService.success('Usuário criado com sucesso.');
          void this.router.navigate(['/admin/usuarios']);
        }),
        catchError((error: unknown) => {
          this.notificationService.error(this.resolveError(error));
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe();
  }

  private resolveError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }

    return 'Não foi possível criar o usuário.';
  }
}
