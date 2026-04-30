import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-input',
  imports: [MatIconModule],
  template: `
    <label class="relative block w-full">
      <span class="sr-only">{{ label() }}</span>
      <mat-icon class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:rgb(107_114_128)]"
        >search</mat-icon
      >
      <input
        type="search"
        autocomplete="off"
        spellcheck="false"
        [placeholder]="placeholder()"
        [value]="value()"
        (input)="updateValue($event)"
        class="h-[3.1875rem] w-full rounded-t-lg border border-b-2 border-[color:rgb(198_197_212)] bg-[color:rgb(243_243_245)] pl-11 pr-4 text-base text-[var(--mat-sys-on-surface)] outline-none focus:border-[color:var(--mat-sys-primary)]"
      />
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  readonly label = input('Search');
  readonly placeholder = input('Search...');
  readonly value = input('');

  readonly valueChanged = output<string>();

  protected updateValue(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.valueChanged.emit(target?.value ?? '');
  }
}
