import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DashboardUser } from '../../../../auth/auth.models';
import { AuthenticatedNavSection } from '../../authenticated-shell.constants';
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
  readonly navigationSections = input<readonly AuthenticatedNavSection[]>([]);

  readonly closeRequested = output<void>();
  readonly logoutRequested = output<void>();
  readonly itemSelected = output<void>();

  protected readonly userRole = computed(() => {
    const rawTitle = this.user()?.title;

    if (!rawTitle || rawTitle === 'Perfil institucional' || rawTitle === 'Professor') {
      return 'Professor(a)';
    }

    if (rawTitle.includes('·') || rawTitle.includes('Revisor') || rawTitle.includes('Administrador')) {
      return rawTitle;
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

  protected onNavigate(): void {
    this.itemSelected.emit();
  }

  protected onClose(): void {
    this.closeRequested.emit();
  }

  protected onLogout(): void {
    this.logoutRequested.emit();
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
