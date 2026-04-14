import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  forwardRef,
  input,
  output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-checkbox',
  imports: [MatCheckboxModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly disabledInput = input(false, { transform: booleanAttribute });

  readonly changed = output<boolean>();

  protected checked = false;
  protected disabled = false;
  protected onChange: (value: boolean) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  writeValue(value: unknown): void {
    this.checked = Boolean(value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected onCheckboxChange(event: MatCheckboxChange): void {
    this.checked = event.checked;
    this.onChange(event.checked);
    this.onTouched();
    this.changed.emit(event.checked);
  }

  protected get isDisabled(): boolean {
    return this.disabled || this.disabledInput();
  }
}
