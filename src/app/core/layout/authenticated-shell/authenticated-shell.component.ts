import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../auth/auth-state.service';
import { AUTHENTICATED_NAV_ITEMS } from './authenticated-shell.constants';
import { AuthenticatedHeaderComponent } from './components/authenticated-header/authenticated-header.component';
import { AuthenticatedSidenavComponent } from './components/authenticated-sidenav/authenticated-sidenav.component';

@Component({
  selector: 'app-authenticated-shell',
  imports: [RouterOutlet, AuthenticatedHeaderComponent, AuthenticatedSidenavComponent],
  templateUrl: './authenticated-shell.component.html',
  styleUrl: './authenticated-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedShellComponent {
  private readonly authStateService = inject(AuthStateService);
  private readonly router = inject(Router);

  protected readonly mobileMenuOpened = signal(false);
  protected readonly desktopSidenavCollapsed = signal(false);
  protected readonly currentUser = computed(() => this.authStateService.currentUser());
  protected readonly navigationItems = AUTHENTICATED_NAV_ITEMS;

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
    void this.router.navigateByUrl('/atividades');
  }

  private async performLogout(): Promise<void> {
    void this.authStateService.logout();
    await this.router.navigateByUrl('/login');
  }

  private isMobileViewport(): boolean {
    return window.matchMedia('(max-width: 63.99rem)').matches;
  }
}
