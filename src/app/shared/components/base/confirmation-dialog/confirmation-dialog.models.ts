import type { ButtonVariant } from '../button/button.component';

export interface ConfirmationDialogData {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly confirmVariant?: ButtonVariant;
  readonly icon?: string;
}
