import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { DashboardHomeHeroComponent } from '../../../dashboard/components/dashboard-home-hero/dashboard-home-hero.component';
import { AdminApiService } from '../../admin-api.service';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [DatePipe, RouterLink, MatIconModule, DashboardHomeHeroComponent],
  templateUrl: './admin-dashboard.page.html',
  styleUrl: './admin-dashboard.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardPage {
  private readonly adminApi = inject(AdminApiService);

  protected readonly homeResource = resource({
    loader: () => firstValueFrom(this.adminApi.getDashboardHome()),
  });

  protected readonly isLoading = computed(() => this.homeResource.status() === 'loading');
  protected readonly hasError = computed(() => this.homeResource.status() === 'error');
  protected readonly homeData = computed(() => this.homeResource.value());
}
