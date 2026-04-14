import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  booleanAttribute,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);

  readonly label = input('');
  readonly placeholder = input('');
  readonly type = input<'text' | 'email' | 'password' | 'number' | 'tel'>('text');
  readonly appearance = input<'fill' | 'outline'>('fill');
  readonly prefixIcon = input<string | null>(null);
  readonly suffixIcon = input<string | null>(null);
  readonly suffixIconAriaLabel = input('Acao no campo');
  readonly suffixAction = input(false, { transform: booleanAttribute });
  readonly hint = input<string | null>(null);
  readonly errorMessage = input<string | null>(null);
  readonly control = input<FormControl | null>(null);
  readonly disabledInput = input(false, { transform: booleanAttribute });

  readonly blurred = output<FocusEvent>();
  readonly suffixClicked = output<void>();

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
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(target.value);
  }

  protected onBlur(event: FocusEvent): void {
    this.onTouched();
    this.blurred.emit(event);
  }

  protected onSuffixClick(): void {
    this.suffixClicked.emit();
  }

  protected get hasError(): boolean {
    const currentControl = this.control();
    return Boolean(currentControl?.invalid && (currentControl?.touched || currentControl?.dirty));
  }

  protected get isDisabled(): boolean {
    return this.disabled || this.disabledInput();
  }
}
