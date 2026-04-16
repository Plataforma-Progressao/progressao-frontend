import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DashboardBienniumCardComponent } from '../../components/dashboard-biennium-card/dashboard-biennium-card.component';
import { DashboardCareerCardComponent } from '../../components/dashboard-career-card/dashboard-career-card.component';
import { DashboardHomeHeroComponent } from '../../components/dashboard-home-hero/dashboard-home-hero.component';
import { DashboardNotificationsCardComponent } from '../../components/dashboard-notifications-card/dashboard-notifications-card.component';
import { DashboardPillarsCardComponent } from '../../components/dashboard-pillars-card/dashboard-pillars-card.component';
import { DashboardScoreCardComponent } from '../../components/dashboard-score-card/dashboard-score-card.component';
import { DashboardApiService } from '../../dashboard-api.service';
import { DashboardHomeData } from '../../models/dashboard-home.models';

@Component({
  selector: 'app-dashboard-home-page',
  imports: [
    DashboardHomeHeroComponent,
    DashboardScoreCardComponent,
    DashboardCareerCardComponent,
    DashboardPillarsCardComponent,
    DashboardBienniumCardComponent,
    DashboardNotificationsCardComponent,
  ],
  templateUrl: './dashboard-home.page.html',
  styleUrl: './dashboard-home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomePage {
  private readonly dashboardApiService = inject(DashboardApiService);

  private readonly fallbackData: DashboardHomeData = {
    displayName: 'Docente',
    roleLabel: 'Associado IV',
    summary: 'Suas métricas de progressão estão atualizadas.',
    score: {
      current: 0,
      target: 2000,
    },
    career: {
      currentLevelLabel: 'Associado IV',
      nextLevelLabel: 'Titular I',
      progressPercentage: 0,
      yearsInLevel: 0,
      yearsRequired: 4,
      qualisPublications: 0,
      qualisTarget: 15,
      supervisions: 0,
      supervisionsTarget: 4,
    },
    pillars: [],
    biennium: {
      cycleLabel: '2023 - 2024',
      completionPercentage: 0,
      departmentComparison: 'Sem comparativo disponível no momento.',
    },
    notifications: [],
  };

  protected readonly homeResource = resource({
    loader: () => firstValueFrom(this.dashboardApiService.getHome()),
  });

  protected readonly isLoading = computed(() => this.homeResource.status() === 'loading');
  protected readonly hasError = computed(() => this.homeResource.status() === 'error');
  protected readonly homeData = computed(() => {
    if (!this.homeResource.hasValue()) {
      return this.fallbackData;
    }

    return this.homeResource.value() ?? this.fallbackData;
  });
}
