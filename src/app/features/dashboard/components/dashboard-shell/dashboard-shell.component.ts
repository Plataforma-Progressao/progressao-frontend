import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../../../core/auth/auth-state.service';
import { DASHBOARD_NAV_ITEMS } from '../../dashboard.constants';
import { DashboardHeaderComponent } from '../dashboard-header/dashboard-header.component';
import { DashboardSidenavComponent } from '../dashboard-sidenav/dashboard-sidenav.component';

@Component({
  selector: 'app-dashboard-shell',
  imports: [RouterOutlet, DashboardHeaderComponent, DashboardSidenavComponent],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardShellComponent {
  private readonly authStateService = inject(AuthStateService);
  private readonly router = inject(Router);

  protected readonly mobileMenuOpened = signal(false);
  protected readonly desktopSidenavCollapsed = signal(false);
  protected readonly currentUser = computed(() => this.authStateService.currentUser());
  protected readonly navigationItems = DASHBOARD_NAV_ITEMS;

  protected toggleMobileMenu(): void {
    if (this.isMobileViewport()) {
      this.mobileMenuOpened.update((current) => !current);
      return;
    }

    this.desktopSidenavCollapsed.update((current) => !current);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpened.set(false);
  }

  protected logout(): void {
    void this.performLogout();
  }

  protected openCreateActivity(): void {
    void this.router.navigateByUrl('/dashboard/atividades');
  }

  private async performLogout(): Promise<void> {
    await this.authStateService.logout();
    await this.router.navigateByUrl('/login');
  }

  private isMobileViewport(): boolean {
    return window.matchMedia('(max-width: 63.99rem)').matches;
  }
}
