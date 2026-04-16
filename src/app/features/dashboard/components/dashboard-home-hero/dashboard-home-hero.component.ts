import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-home-hero',
  templateUrl: './dashboard-home-hero.component.html',
  styleUrl: './dashboard-home-hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHomeHeroComponent {
  readonly eyebrow = input('Visao geral do curador');
  readonly title = input('Visao geral do curador');
  readonly summary = input('Suas metricas de progressao estao atualizadas.');
}
