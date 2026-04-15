import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardUser } from '../../../../core/auth/auth.models';
import { DASHBOARD_NAV_ITEMS, DashboardNavItem } from '../../dashboard.constants';
import { DashboardNavItemComponent } from '../dashboard-nav-item/dashboard-nav-item.component';

@Component({
  selector: 'app-dashboard-sidenav',
  imports: [MatIconModule, MatButtonModule, DashboardNavItemComponent],
  templateUrl: './dashboard-sidenav.component.html',
  styleUrl: './dashboard-sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSidenavComponent {
  readonly user = input<DashboardUser | null>(null);
  readonly opened = input(false);
  readonly navigationItems = input<readonly DashboardNavItem[]>(DASHBOARD_NAV_ITEMS);

  readonly closeRequested = output<void>();
  readonly logoutRequested = output<void>();
  readonly itemSelected = output<void>();

  protected onNavigate(): void {
    this.itemSelected.emit();
  }

  protected onClose(): void {
    this.closeRequested.emit();
  }

  protected onLogout(): void {
    this.logoutRequested.emit();
  }
}
