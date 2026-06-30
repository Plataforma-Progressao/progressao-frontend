import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { DashboardUser } from '../../../../auth/auth.models';
import { UserNotification } from '../../../../notifications/user-notifications.models';

@Component({
  selector: 'app-authenticated-header',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    RouterLink,
  ],
  templateUrl: './authenticated-header.component.html',
  styleUrl: './authenticated-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedHeaderComponent {
  readonly user = input<DashboardUser | null>(null);
  readonly mobileMenuOpened = input(false);
  readonly unreadCount = input(0);
  readonly notifications = input<readonly UserNotification[]>([]);

  readonly menuToggle = output<void>();
  readonly logoutRequested = output<void>();
  readonly notificationRead = output<string>();

  protected readonly userShortName = computed(() => this.user()?.name ?? 'Docente');
  protected readonly userRole = computed(() => {
    const rawTitle = this.user()?.title;

    if (!rawTitle || rawTitle === 'Perfil institucional' || rawTitle === 'Professor') {
      return 'Professor(a)';
    }
    const parts = rawTitle.split('-');
    const careerClass = parts[0] || '';
    let currentLevel = parts[1] ? parts[1].trim().toUpperCase() : 'I';
    if (currentLevel === 'L') {
      currentLevel = 'I';
    }

    const normalizedCareerClass = this.normalizeCareerClass(careerClass);
    return `Professor(a) ${normalizedCareerClass} ${currentLevel}`;
  });

  protected readonly badgeContent = computed(() => {
    const count = this.unreadCount();
    if (count <= 0) {
      return null;
    }
    if (count >= 100) {
      return '99+';
    }
    return String(count);
  });

  protected readonly showBadge = computed(() => this.unreadCount() > 0);

  protected onMenuClick(): void {
    this.menuToggle.emit();
  }

  protected onLogout(): void {
    this.logoutRequested.emit();
  }

  protected onNotificationClick(notification: UserNotification): void {
    if (!notification.isRead) {
      this.notificationRead.emit(notification.id);
    }
  }

  protected notificationToneClass(tone: UserNotification['tone']): string {
    switch (tone) {
      case 'SUCCESS':
        return 'dashboard-header__notification-item--success';
      case 'WARNING':
        return 'dashboard-header__notification-item--warning';
      case 'ERROR':
        return 'dashboard-header__notification-item--error';
      default:
        return 'dashboard-header__notification-item--info';
    }
  }

  private normalizeCareerClass(careerClass: string): string {
    const normalized = careerClass.trim().toLowerCase();

    switch (normalized) {
      case 'auxiliar':
        return 'Auxiliar';
      case 'assistente':
        return 'Assistente';
      case 'adjunto':
        return 'Adjunto';
      case 'associado':
        return 'Associado';
      case 'titular':
        return 'Titular';
      default:
        return careerClass.charAt(0).toUpperCase() + careerClass.slice(1).toLowerCase();
    }
  }
}
