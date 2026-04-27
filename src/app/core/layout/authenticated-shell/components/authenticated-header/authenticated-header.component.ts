import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardUser } from '../../../../auth/auth.models';

@Component({
  selector: 'app-authenticated-header',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './authenticated-header.component.html',
  styleUrl: './authenticated-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticatedHeaderComponent {
  readonly user = input<DashboardUser | null>(null);
  readonly mobileMenuOpened = input(false);

  readonly menuToggle = output<void>();

  protected readonly userShortName = computed(() => this.user()?.name ?? 'Docente');
  protected readonly userRole = computed(() => this.user()?.title ?? 'Professor');

  protected onMenuClick(): void {
    this.menuToggle.emit();
  }
}

