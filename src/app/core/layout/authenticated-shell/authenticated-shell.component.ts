import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { catchError, EMPTY, interval, startWith, switchMap, tap } from 'rxjs';
import { AuthStateService } from '../../auth/auth-state.service';
import { UserNotificationsApiService } from '../../notifications/user-notifications-api.service';
import { UserNotification } from '../../notifications/user-notifications.models';
import {
  AuthenticatedNavSection,
  buildNavSectionsForRoles,
} from './authenticated-shell.constants';
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
  private readonly notificationsApi = inject(UserNotificationsApiService);

  protected readonly mobileMenuOpened = signal(false);
  protected readonly desktopSidenavCollapsed = signal(false);
  protected readonly unreadCount = signal(0);
  protected readonly recentNotifications = signal<readonly UserNotification[]>([]);
  protected readonly currentUser = computed(() => this.authStateService.currentUser());
  protected readonly navigationSections = computed((): readonly AuthenticatedNavSection[] => {
    const roles = this.currentUser()?.roles ?? [];
    return buildNavSectionsForRoles(roles);
  });

  constructor() {
    interval(60_000)
      .pipe(
        startWith(0),
        switchMap(() => this.refreshNotifications()),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

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

  protected markNotificationRead(notificationId: string): void {
    this.notificationsApi
      .markRead(notificationId)
      .pipe(
        tap(() => this.refreshNotifications().subscribe()),
        catchError(() => EMPTY),
      )
      .subscribe();
  }

  private refreshNotifications() {
    return this.notificationsApi.list({ page: 1, pageSize: 5 }).pipe(
      tap((response) => {
        this.recentNotifications.set(response.items);
      }),
      switchMap(() =>
        this.notificationsApi.unreadCount().pipe(
          tap((result) => this.unreadCount.set(result.count)),
          catchError(() => {
            this.unreadCount.set(0);
            return EMPTY;
          }),
        ),
      ),
      catchError(() => {
        this.recentNotifications.set([]);
        this.unreadCount.set(0);
        return EMPTY;
      }),
    );
  }

  private async performLogout(): Promise<void> {
    void this.authStateService.logout();
    await this.router.navigateByUrl('/login');
  }

  private isMobileViewport(): boolean {
    return window.matchMedia('(max-width: 63.99rem)').matches;
  }
}
