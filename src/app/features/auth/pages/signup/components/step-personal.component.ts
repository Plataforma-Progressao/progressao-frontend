import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
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
  get showCpfError(): boolean {
    const cpfControl = this.form().get('cpf');
    if (!cpfControl) return false;

    const value = cpfControl.value || '';
    const apenasNumeros = value.replace(/\D/g, '');
    return apenasNumeros.length === 11 && cpfControl.invalid;
  }
}