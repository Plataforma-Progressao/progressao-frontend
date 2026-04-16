import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DashboardHomeBiennium } from '../../models/dashboard-home.models';

@Component({
  selector: 'app-dashboard-biennium-card',
  templateUrl: './dashboard-biennium-card.component.html',
  styleUrl: './dashboard-biennium-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardBienniumCardComponent {
  readonly biennium = input.required<DashboardHomeBiennium>();
}
