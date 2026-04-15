import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardUser } from '../../../../auth/auth.models';
import { AUTHENTICATED_NAV_ITEMS, AuthenticatedNavItem } from '../../authenticated-shell.constants';
import { AuthenticatedNavItemComponent } from '../authenticated-nav-item/authenticated-nav-item.component';

@Component({
  selector: 'app-authenticated-sidenav',
  imports: [MatIconModule, MatButtonModule, AuthenticatedNavItemComponent],
  templateUrl: './authenticated-sidenav.component.html',
  styleUrl: './authenticated-sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedSidenavComponent {
  readonly user = input<DashboardUser | null>(null);
  readonly opened = input(false);
  readonly collapsed = input(false);
  readonly navigationItems = input<readonly AuthenticatedNavItem[]>(AUTHENTICATED_NAV_ITEMS);

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
