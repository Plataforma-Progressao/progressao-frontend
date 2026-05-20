import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent, type ButtonVariant } from '../button/button.component';
import type { ConfirmationDialogData } from './confirmation-dialog.models';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MatDialogModule, MatIconModule, ButtonComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'alertdialog',
    'aria-modal': 'true',
    'aria-labelledby': 'confirmation-dialog-title',
    'aria-describedby': 'confirmation-dialog-message',
  },
})
export class ConfirmationDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent, boolean>);
  protected readonly data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);

  protected get confirmLabel(): string {
    return this.data.confirmLabel ?? 'Confirmar';
  }

  protected get cancelLabel(): string {
    return this.data.cancelLabel ?? 'Cancelar';
  }

  protected get confirmVariant(): ButtonVariant {
    return this.data.confirmVariant ?? 'primary';
  }

  protected get icon(): string {
    return this.data.icon ?? 'warning';
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }

  protected confirm(): void {
    this.dialogRef.close(true);
  }
}
