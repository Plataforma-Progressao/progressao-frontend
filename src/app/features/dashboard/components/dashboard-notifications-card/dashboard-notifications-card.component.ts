import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardHomeNotification } from '../../models/dashboard-home.models';

@Component({
  selector: 'app-dashboard-notifications-card',
  imports: [MatIconModule],
  templateUrl: './dashboard-notifications-card.component.html',
  styleUrl: './dashboard-notifications-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNotificationsCardComponent {
  readonly notifications = input.required<readonly DashboardHomeNotification[]>();
}
