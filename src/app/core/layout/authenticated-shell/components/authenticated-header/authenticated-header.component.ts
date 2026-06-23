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

  protected onMenuClick(): void {
    this.menuToggle.emit();
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