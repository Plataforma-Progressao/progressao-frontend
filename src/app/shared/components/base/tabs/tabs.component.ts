import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  imports: [],
  template: `
    <nav
      class="flex items-center border-b border-b-[color:rgba(198,197,212,0.3)]"
      [attr.aria-label]="ariaLabel()"
    >
      @for (tab of tabs(); track tab) {
      <button
        type="button"
        [class]="getTabButtonClass(tab)"
        [attr.aria-current]="activeTab() === tab ? 'page' : null"
        (click)="onSelectTab(tab)"
      >
        {{ tab }}
      </button>
      }
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  readonly tabs = input<readonly string[]>([]);
  readonly activeTab = input<string>('');
  readonly ariaLabel = input('Tabs');

  readonly tabSelected = output<string>();

  protected getTabButtonClass(tab: string): string {
    const base = 'relative -mb-px px-6 py-4 text-center text-sm leading-5 transition';
    if (this.activeTab() === tab) {
      return `${base} border-b-2 border-b-[color:var(--mat-sys-primary)] font-bold text-[color:var(--mat-sys-primary)]`;
    }
    return `${base} font-semibold text-[color:rgb(69_70_82)]`;
  }

  protected onSelectTab(tab: string): void {
    this.tabSelected.emit(tab);
  }
}
