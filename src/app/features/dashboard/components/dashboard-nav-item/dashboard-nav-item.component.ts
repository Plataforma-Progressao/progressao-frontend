import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DashboardNavItem } from '../../dashboard.constants';

@Component({
  selector: 'app-dashboard-nav-item',
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './dashboard-nav-item.component.html',
  styleUrl: './dashboard-nav-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardNavItemComponent {
  readonly item = input.required<DashboardNavItem>();
  readonly exact = input(false);
}
