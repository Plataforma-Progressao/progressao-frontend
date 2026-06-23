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
import { ControlValueAccessor, AbstractControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { formatCpfValue, formatPhoneValue } from '../../../forms/br-form.utils';

type InputMask = 'none' | 'cpf' | 'phone';

@Component({
  selector: 'app-input',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, NgxMaskDirective],
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

  readonly floatLabel = input<'auto' | 'always'>('auto');
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
  readonly control = input<AbstractControl | null>(null);
  readonly disabledInput = input(false, { transform: booleanAttribute });
  readonly mask = input<InputMask>('none');
  /** ngx-mask pattern (ex.: `Hh:m0` para horas e minutos). */
  readonly ngxMaskPattern = input<string | null>(null);

  readonly blurred = output<FocusEvent>();
  readonly suffixClicked = output<void>();

  protected value = '';
  protected disabled = false;
  protected onChange: (value: string | number) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  writeValue(value: string | number | null): void {
    if (this.ngxMaskPattern()) {
      this.value = value === null || value === undefined ? '' : String(value);
      this.cdr.markForCheck();
      return;
    }

    if (this.type() === 'number') {
      const numeric =
        value === null || value === undefined || value === ''
          ? ''
          : String(value);
      this.value = numeric;
      this.cdr.markForCheck();
      return;
    }

    this.value = this.applyMask(value === null || value === undefined ? '' : String(value));
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string | number) => void): void {
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

    if (this.ngxMaskPattern()) {
      this.value = target.value;
      this.onChange(target.value);
      return;
    }

    if (this.type() === 'number') {
      const sanitized = target.value.replace(/[^\d]/g, '');
      this.value = sanitized;
      target.value = sanitized;
      this.onChange(sanitized === '' ? 0 : Number(sanitized));
      return;
    }

    const selectionStart = target.selectionStart ?? target.value.length;
    const digitsBeforeCaret = this.countDigits(target.value.slice(0, selectionStart));
    const maskedValue = this.applyMask(target.value);

    this.value = maskedValue;
    target.value = maskedValue;

    if (this.mask() !== 'none') {
      const nextCaret = this.findCaretPosition(maskedValue, digitsBeforeCaret);
      target.setSelectionRange(nextCaret, nextCaret);
    }

    this.onChange(maskedValue);
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

  protected get usesNgxMask(): boolean {
    return Boolean(this.ngxMaskPattern());
  }

  protected get maxLength(): number | null {
    if (this.mask() === 'cpf') {
      return 14;
    }

    if (this.mask() === 'phone') {
      return 15;
    }

    return null;
  }

  private applyMask(value: string): string {
    if (this.mask() === 'cpf') {
      return formatCpfValue(value);
    }

    if (this.mask() === 'phone') {
      return formatPhoneValue(value);
    }

    return value;
  }

  private countDigits(value: string): number {
    return value.replace(/\D/g, '').length;
  }

  private findCaretPosition(maskedValue: string, digitsBeforeCaret: number): number {
    if (digitsBeforeCaret <= 0) {
      return 0;
    }

    let digitCount = 0;

    for (let index = 0; index < maskedValue.length; index += 1) {
      if (/\d/.test(maskedValue[index])) {
        digitCount += 1;
      }

      if (digitCount >= digitsBeforeCaret) {
        return index + 1;
      }
    }

    return maskedValue.length;
  }
}
