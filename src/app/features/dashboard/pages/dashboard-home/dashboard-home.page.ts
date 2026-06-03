import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DashboardBienniumCardComponent } from '../../components/dashboard-biennium-card/dashboard-biennium-card.component';
import { DashboardCareerCardComponent } from '../../components/dashboard-career-card/dashboard-career-card.component';
import { DashboardHomeHeroComponent } from '../../components/dashboard-home-hero/dashboard-home-hero.component';
import { DashboardNotificationsCardComponent } from '../../components/dashboard-notifications-card/dashboard-notifications-card.component';
import { DashboardPillarsCardComponent } from '../../components/dashboard-pillars-card/dashboard-pillars-card.component';
import { DashboardScoreCardComponent } from '../../components/dashboard-score-card/dashboard-score-card.component';
import { DashboardApiService } from '../../dashboard-api.service';

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

  protected readonly homeResource = resource({
    loader: () => firstValueFrom(this.dashboardApiService.getHome()),
  });

  protected readonly isLoading = computed(() => this.homeResource.status() === 'loading');
  protected readonly hasError = computed(() => this.homeResource.status() === 'error');
  protected readonly hasHomeData = computed(() => this.homeResource.hasValue());
  protected readonly homeData = computed(() => this.homeResource.value());
}
