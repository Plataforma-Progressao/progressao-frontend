import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-select',
  imports: [MatIconModule],
  template: `
    <div class="relative w-full">
      <button
        type="button"
        class="flex h-[3.1875rem] w-full items-center justify-between rounded-t-lg border border-b-2 border-[color:rgb(198_197_212)] bg-[color:rgb(243_243_245)] px-4 text-left text-base text-[var(--mat-sys-on-surface)]"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-label]="label()"
        (click)="toggleOpen()"
      >
        <span>{{ selectedLabel() }}</span>
        <mat-icon class="text-[color:rgb(69_70_82)]">{{ isOpen() ? 'expand_less' : 'expand_more' }}</mat-icon>
      </button>

      <div class="sr-only" aria-live="polite">{{ selectedLabel() }}</div>

      @if (isOpen()) {
      <div
        class="absolute left-0 right-0 top-full z-10 border border-t-0 border-[color:rgb(198_197_212)] bg-white"
        role="listbox"
      >
        @for (option of options(); track option.value) {
        <button
          type="button"
          class="block w-full px-4 py-3 text-left text-base hover:bg-[color:rgb(243_243_245)] focus:bg-[color:rgb(243_243_245)] outline-none"
          [attr.aria-selected]="selectedValue() === option.value"
          [class.bg-[color:var(--mat-sys-primary)]]="selectedValue() === option.value"
          [class.text-white]="selectedValue() === option.value"
          (click)="onSelectOption(option.value)"
        >
          {{ option.label }}
        </button>
        }
      </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  readonly label = input('Select');
  readonly options = input<readonly { label: string; value: string }[]>([]);
  readonly selectedValue = input('');

  readonly valueChanged = output<string>();

  protected isOpen = signal(false);

  protected selectedLabel = computed(() => {
    const selected = this.options().find((opt) => opt.value === this.selectedValue());
    return selected?.label ?? this.label();
  });

  protected toggleOpen(): void {
    this.isOpen.update((open) => !open);
  }

  protected onSelectOption(value: string): void {
    this.valueChanged.emit(value);
    this.isOpen.set(false);
  }
}
