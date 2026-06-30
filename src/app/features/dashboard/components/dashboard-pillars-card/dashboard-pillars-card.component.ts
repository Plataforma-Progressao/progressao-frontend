import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DashboardHomePillar } from '../../models/dashboard-home.models';

export interface PillarViewModel extends DashboardHomePillar {
  readonly ceilingPercentage: number;
  readonly alertLevel: 'normal' | 'warning' | 'danger';
}

@Component({
  selector: 'app-dashboard-pillars-card',
  templateUrl: './dashboard-pillars-card.component.html',
  styleUrl: './dashboard-pillars-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPillarsCardComponent {
  readonly pillars = input.required<readonly DashboardHomePillar[]>();

  protected readonly hasApprovedScores = computed(() =>
    this.pillars().some((pillar) => pillar.score > 0),
  );

  protected readonly pillarViews = computed((): readonly PillarViewModel[] =>
    this.pillars().map((pillar) => {
      const ceilingPercentage =
        pillar.ceiling > 0 ? Math.min(100, Math.round((pillar.score / pillar.ceiling) * 100)) : 0;

      let alertLevel: PillarViewModel['alertLevel'] = 'normal';
      if (pillar.atCeiling) {
        alertLevel = 'danger';
      } else if (ceilingPercentage >= 90) {
        alertLevel = 'warning';
      }

      return {
        ...pillar,
        ceilingPercentage,
        alertLevel,
      };
    }),
  );
}
