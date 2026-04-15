import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

type ToastVariant = 'error' | 'success' | 'info';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);
  private lastMessage = '';
  private lastShownAt = 0;

  error(message: string): void {
    this.open(message, 'error');
  }

  success(message: string): void {
    this.open(message, 'success');
  }

  info(message: string): void {
    this.open(message, 'info');
  }

  private open(message: string, variant: ToastVariant): void {
    const normalizedMessage = message.trim() || 'Ocorreu um erro inesperado.';
    const now = Date.now();

    // Avoid stacking identical toasts in quick successive failures.
    if (this.lastMessage === normalizedMessage && now - this.lastShownAt < 1200) {
      return;
    }

    this.lastMessage = normalizedMessage;
    this.lastShownAt = now;

    this.snackBar.open(normalizedMessage, 'Fechar', {
      duration: variant === 'error' ? 6000 : 3500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['app-toast', `app-toast--${variant}`],
    });
  }
}
