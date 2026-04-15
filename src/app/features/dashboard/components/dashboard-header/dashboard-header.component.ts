import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '../../../../shared';
import { DashboardUser } from '../../../../core/auth/auth.models';

@Component({
  selector: 'app-dashboard-header',
  imports: [MatIconModule, MatButtonModule, ButtonComponent],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeaderComponent {
  readonly user = input<DashboardUser | null>(null);
  readonly mobileMenuOpened = input(false);

  readonly menuToggle = output<void>();
  readonly addActivity = output<void>();

  protected readonly searchQuery = signal('');
  protected readonly userShortName = computed(() => this.user()?.name ?? 'Docente');
  protected readonly userRole = computed(() => this.user()?.title ?? 'Professor');

  protected onMenuClick(): void {
    this.menuToggle.emit();
  }

  protected onAddActivity(): void {
    this.addActivity.emit();
  }

  protected onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  protected clearSearch(): void {
    this.searchQuery.set('');
  }
}
