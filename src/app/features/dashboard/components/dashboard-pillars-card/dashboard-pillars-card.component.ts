import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DashboardHomePillar } from '../../models/dashboard-home.models';

@Component({
  selector: 'app-dashboard-pillars-card',
  templateUrl: './dashboard-pillars-card.component.html',
  styleUrl: './dashboard-pillars-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPillarsCardComponent {
  readonly pillars = input.required<readonly DashboardHomePillar[]>();
}
