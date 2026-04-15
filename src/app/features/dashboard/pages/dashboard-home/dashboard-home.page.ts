import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DASHBOARD_NOTIFICATIONS, DASHBOARD_PILLARS } from '../../dashboard.constants';

@Component({
  selector: 'app-dashboard-home-page',
  imports: [MatIconModule, DecimalPipe],
  templateUrl: './dashboard-home.page.html',
  styleUrl: './dashboard-home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomePage {
  protected readonly quarterTarget = 2000;
  protected readonly currentScore = 1420;
  protected readonly nextLevelProgress = 73;
  protected readonly pillarProgress = DASHBOARD_PILLARS;
  protected readonly notifications = DASHBOARD_NOTIFICATIONS;
}
