import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DashboardHomeScore } from '../../models/dashboard-home.models';

@Component({
  selector: 'app-dashboard-score-card',
  imports: [DecimalPipe],
  templateUrl: './dashboard-score-card.component.html',
  styleUrl: './dashboard-score-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardScoreCardComponent {
  readonly score = input.required<DashboardHomeScore>();

  protected readonly progress = computed(() => {
    const target = this.score().target;
    if (target <= 0) {
      return 0;
    }

    return Math.min(this.score().current / target, 1);
  });
}
