import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent, InputComponent } from '../../../../../shared';

@Component({
  selector: 'app-step-security',
  imports: [ReactiveFormsModule, MatIconModule, InputComponent, CheckboxComponent],
  templateUrl: './step-security.component.html',
  styleUrl: './step-security.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepSecurityComponent {
  form = input.required<FormGroup>();

  hidePassword = signal(true);
  hidePasswordConfirm = signal(true);

  togglePassword(): void {
    this.hidePassword.update((v) => !v);
  }

  togglePasswordConfirm(): void {
    this.hidePasswordConfirm.update((v) => !v);
  }
}
