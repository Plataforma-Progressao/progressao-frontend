import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'icon';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('medium');
  readonly label = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly fullWidth = input(false, { transform: booleanAttribute });
  readonly compact = input(false, { transform: booleanAttribute });
  readonly type = input<ButtonType>('button');
  readonly icon = input<string | null>(null);
  readonly prefixIcon = input<string | null>(null);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly ariaCurrent = input<string | null>(null);

  readonly clicked = output<void>();

  protected onClick(): void {
    if (!this.loading() && !this.disabled()) {
      this.clicked.emit();
    }
  }

  protected get buttonClass(): string {
    const classes = ['app-btn', `app-btn--${this.variant()}`, `app-btn--${this.size()}`];
    if (this.fullWidth()) classes.push('app-btn--block');
    if (this.compact()) classes.push('app-btn--compact');
    if (this.loading()) classes.push('app-btn--loading');
    return classes.join(' ');
  }

  protected get isIconButton(): boolean {
    return this.variant() === 'icon';
  }

  protected get isDisabled(): boolean {
    return this.disabled() || this.loading();
  }
}
