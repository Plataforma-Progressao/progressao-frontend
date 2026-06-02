import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { startWith } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

interface ProjectionYear {
  readonly year: number;
  readonly score: number;
  readonly heightPercent: number;
  readonly isGoal: boolean;
}

const BASE_BY_AREA: Record<string, number> = {
  ai: 15,
  bio: 15,
  sys: 12,
  data: 12,
};

@Component({
  selector: 'app-step-career',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonToggleModule,
    MatIconModule,
  ],
  templateUrl: './step-career.component.html',
  styleUrl: './step-career.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepCareerComponent {
  form = input.required<FormGroup>();

  protected readonly projectionYears = signal<readonly ProjectionYear[]>([]);
  protected readonly projectionSummary = signal('Preencha os dados para ver a projeção estimada.');

  protected readonly maxProjectionScore = computed(() => {
    const years = this.projectionYears();
    return years.length > 0 ? Math.max(...years.map((y) => y.score), 1) : 1;
  });

  constructor() {
    effect((onCleanup) => {
      const group = this.form();
      const subscription = group.valueChanges
        .pipe(startWith(group.getRawValue()))
        .subscribe((value) => {
          this.updateProjection(value as {
            practiceAreas?: string[];
            careerClass?: string;
            currentLevel?: string;
            lastProgressionDate?: string;
          });
        });

      onCleanup(() => subscription.unsubscribe());
    });
  }

  protected barHeight(year: ProjectionYear): string {
    const max = this.maxProjectionScore();
    const percent = Math.max(8, Math.round((year.score / max) * 100));
    return `${percent}%`;
  }

  private updateProjection(value: {
    practiceAreas?: string[];
    careerClass?: string;
    currentLevel?: string;
    lastProgressionDate?: string;
  }): void {
    const areas = value.practiceAreas ?? [];
    const dateValue = value.lastProgressionDate;
    const startYear = dateValue ? new Date(dateValue).getFullYear() : new Date().getFullYear();
    const perYearIncrement = areas.reduce(
      (sum, area) => sum + (BASE_BY_AREA[area] ?? 10) + 2.5,
      0,
    );

    let cumulative = 0;
    const years: ProjectionYear[] = [];

    for (let index = 0; index < 4; index += 1) {
      const year = startYear + index;
      cumulative += perYearIncrement;
      years.push({
        year,
        score: Math.round(cumulative * 10) / 10,
        heightPercent: 0,
        isGoal: index === 3,
      });
    }

    this.projectionYears.set(years);

    const careerClass = value.careerClass ?? '—';
    const level = value.currentLevel ?? '—';
    const goalYear = years[years.length - 1]?.year ?? startYear + 3;

    this.projectionSummary.set(
      areas.length === 0
        ? 'Selecione ao menos uma área de atuação para estimar a evolução de pontuação.'
        : `Projeção ilustrativa: ${this.formatCareerClass(careerClass)} ${level} com acúmulo de ~${Math.round(cumulative)} pts até ${goalYear}.`,
    );
  }

  private formatCareerClass(value: string): string {
    const labels: Record<string, string> = {
      auxiliar: 'Auxiliar',
      assistente: 'Assistente',
      adjunto: 'Adjunto',
      associado: 'Associado',
      titular: 'Titular',
    };

    return labels[value] ?? value;
  }
}
