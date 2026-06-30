import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DashboardHomeHeroComponent } from '../../../dashboard/components/dashboard-home-hero/dashboard-home-hero.component';
import { EvaluatorApiService } from '../../evaluator-api.service';

@Component({
  selector: 'app-evaluator-dashboard-page',
  imports: [RouterLink, DashboardHomeHeroComponent],
  templateUrl: './evaluator-dashboard.page.html',
  styleUrl: './evaluator-dashboard.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluatorDashboardPage {
  private readonly evaluatorApi = inject(EvaluatorApiService);

  protected readonly homeResource = resource({
    loader: () => firstValueFrom(this.evaluatorApi.getDashboardHome()),
  });

  protected readonly isLoading = computed(() => this.homeResource.status() === 'loading');
  protected readonly hasError = computed(() => this.homeResource.status() === 'error');
  protected readonly homeData = computed(() => this.homeResource.value());
}
