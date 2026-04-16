import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-step-institution',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './step-institution.component.html',
  styleUrl: './step-institution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepInstitutionComponent {
  form = input.required<FormGroup>();
}
