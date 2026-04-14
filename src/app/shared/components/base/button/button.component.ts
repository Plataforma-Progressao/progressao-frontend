import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule, MatIconModule],
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
  readonly type = input<ButtonType>('button');
  readonly icon = input<string | null>(null);

  readonly clicked = output<void>();

  protected onClick(): void {
    this.clicked.emit();
  }

  protected get buttonClass(): string {
    return `app-btn app-btn--${this.variant()} app-btn--${this.size()}${this.fullWidth() ? ' app-btn--block' : ''}`;
  }
}
