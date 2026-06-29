import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthRole } from '../../../../core/auth/auth.models';
import { AdminUserListItem, ROLE_LABELS } from '../../models/admin.models';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { CheckboxComponent } from '../../../../shared/components/base/checkbox/checkbox.component';

interface AdminEditRolesDialogData {
  user: AdminUserListItem;
  roleLabels: typeof ROLE_LABELS;
}

@Component({
  selector: 'app-admin-edit-roles-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, ButtonComponent, CheckboxComponent],
  template: `
    <h2 mat-dialog-title>Papéis de {{ data.user.name }}</h2>
    <div mat-dialog-content class="roles-dialog">
      <label class="roles-dialog__item">
        <app-checkbox [formControl]="form.controls.user" label="Docente (USER)"></app-checkbox>
      </label>
      <label class="roles-dialog__item">
        <app-checkbox [formControl]="form.controls.evaluator" label="Revisor (EVALUATOR)"></app-checkbox>
      </label>
      <label class="roles-dialog__item">
        <app-checkbox [formControl]="form.controls.admin" label="Administrador (ADMIN)"></app-checkbox>
      </label>
    </div>
    <div mat-dialog-actions align="end">
      <app-button variant="tertiary" label="Cancelar" (clicked)="close()"></app-button>
      <app-button variant="primary" label="Salvar" (clicked)="save()"></app-button>
    </div>
  `,
  styles: `
    .roles-dialog {
      display: grid;
      gap: 0.75rem;
      padding-top: 0.5rem;
    }
    .roles-dialog__item {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEditRolesDialogComponent {
  protected readonly data = inject<AdminEditRolesDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<AdminEditRolesDialogComponent>);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    user: this.data.user.roles.includes('USER'),
    evaluator: this.data.user.roles.includes('EVALUATOR'),
    admin: this.data.user.roles.includes('ADMIN'),
  });

  protected close(): void {
    this.dialogRef.close();
  }

  protected save(): void {
    const roles: AuthRole[] = [];
    if (this.form.controls.user.value) roles.push('USER');
    if (this.form.controls.evaluator.value) roles.push('EVALUATOR');
    if (this.form.controls.admin.value) roles.push('ADMIN');

    if (roles.length === 0) {
      return;
    }

    this.dialogRef.close(roles);
  }
}
