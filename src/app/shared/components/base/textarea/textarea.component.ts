import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  booleanAttribute,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-textarea',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly label = input('');
  readonly placeholder = input('');
  readonly rows = input(4);
  readonly appearance = input<'fill' | 'outline'>('fill');
  readonly hint = input<string | null>(null);
  readonly errorMessage = input<string | null>(null);
  readonly requiredErrorMessage = input<string | null>(null);
  readonly minLengthErrorMessage = input<string | null>(null);
  readonly maxLengthErrorMessage = input<string | null>(null);
  readonly control = input<AbstractControl | null>(null);
  readonly disabledInput = input(false, { transform: booleanAttribute });

  protected value = '';
  protected disabled = false;
  protected onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value = value ?? '';
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChange(target.value);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  protected get hasError(): boolean {
    const currentControl = this.control();
    return Boolean(currentControl?.invalid && (currentControl?.touched || currentControl?.dirty));
  }

  protected get isDisabled(): boolean {
    return this.disabled || this.disabledInput();
  }

  protected get maxLength(): number | null {
    const currentControl = this.control();
    return currentControl?.getError('maxlength')?.requiredLength ?? null;
  }

  protected get resolvedErrorMessage(): string | null {
    const currentControl = this.control();
    if (!currentControl || !this.hasError) {
      return null;
    }

    if (currentControl.hasError('required')) {
      return this.requiredErrorMessage() ?? this.errorMessage();
    }

    if (currentControl.hasError('minlength')) {
      return this.minLengthErrorMessage() ?? this.errorMessage();
    }

    if (currentControl.hasError('maxlength')) {
      return this.maxLengthErrorMessage() ?? this.errorMessage();
    }

    return this.errorMessage();
  }
}
