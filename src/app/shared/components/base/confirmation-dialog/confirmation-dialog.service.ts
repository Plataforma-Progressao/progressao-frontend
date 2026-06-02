import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import type { ConfirmationDialogData } from './confirmation-dialog.models';

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  private readonly dialog = inject(MatDialog);

  open(data: ConfirmationDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data,
      width: '28rem',
      maxWidth: '95vw',
      autoFocus: 'dialog',
      restoreFocus: true,
      panelClass: ['app-confirmation-dialog-panel'],
    });

    return dialogRef.afterClosed();
  }
}
