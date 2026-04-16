import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DashboardHomeCareer } from '../../models/dashboard-home.models';

@Component({
  selector: 'app-dashboard-career-card',
  templateUrl: './dashboard-career-card.component.html',
  styleUrl: './dashboard-career-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCareerCardComponent {
  readonly career = input.required<DashboardHomeCareer>();
}
