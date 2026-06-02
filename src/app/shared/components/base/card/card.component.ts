import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  template: `<div [class]="containerClass">
    <ng-content></ng-content>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly variant = input<'default' | 'elevated' | 'filled'>('default');
  readonly padding = input<'none' | 'small' | 'medium' | 'large'>('medium');

  protected get containerClass(): string {
    const baseClass =
      'overflow-hidden rounded-xl bg-[var(--mat-sys-surface-container)] shadow-[0_0_0_1px_rgba(198,197,212,0.1),0_1px_2px_rgba(0,0,0,0.05)]';

    const paddingClasses: Record<'none' | 'small' | 'medium' | 'large', string> = {
      none: '',
      small: 'p-4',
      medium: 'p-6',
      large: 'p-8',
    };

    return `${baseClass} ${paddingClasses[this.padding()]}`;
  }
}
