import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { formatCpfValue, formatPhoneValue } from '../../../../../shared/forms/br-form.utils';
import { InputComponent } from '../../../../../shared';

@Component({
  selector: 'app-step-personal',
  imports: [ReactiveFormsModule, MatIconModule, InputComponent],
  templateUrl: './step-personal.component.html',
  styleUrl: './step-personal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepPersonalComponent {
  form = input.required<FormGroup>();

  onCpfInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const formattedValue = formatCpfValue(inputElement.value);
    this.form().get('cpf')?.setValue(formattedValue, { emitEvent: false });
    inputElement.value = formattedValue;
  }

  onPhoneInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const formattedValue = formatPhoneValue(inputElement.value);
    this.form().get('phone')?.setValue(formattedValue, { emitEvent: false });
    inputElement.value = formattedValue;
  }
}
