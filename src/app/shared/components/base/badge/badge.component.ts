import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'secondary' | 'info';

@Component({
  selector: 'app-badge',
  imports: [],
  template: `<span [class]="badgeClass">
    <ng-content></ng-content>
  </span>`,
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('primary');

  protected get badgeClass(): string {
    const baseClass =
      'inline-flex items-center rounded px-2 py-1 text-[0.8125rem] font-bold uppercase leading-4';

    const variantClasses: Record<BadgeVariant, string> = {
      primary: 'bg-[color:var(--mat-sys-primary)] text-white',
      success: 'bg-[rgb(20,180,139)] text-white',
      warning: 'bg-[rgb(245,158,11)] text-white',
      error: 'bg-[color:var(--mat-sys-error)] text-white',
      secondary: 'bg-[rgb(156,163,175)] text-[color:rgb(26_28_29)]',
      info: 'bg-[rgb(90,84,234)] text-white',
    };

    return `${baseClass} ${variantClasses[this.variant()]}`;
  }
}
