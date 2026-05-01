import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  ActivityCategory,
  ReportActivity,
  ReportInstitutionMetadata,
  ReportTeacherProfile,
} from '../../models/report-data.model';

interface CategorySummaryRow {
  readonly category: ActivityCategory;
  readonly displayLabel: string;
  readonly hours: number;
  readonly points: number;
  readonly minimumTarget: number;
}

@Component({
  selector: 'app-rad-document',
  imports: [MatIconModule],
  template: `
    <article class="rad-document">
      <header class="rad-document__institution">
        <div class="rad-document__logo" aria-hidden="true">
          <mat-icon>school</mat-icon>
        </div>
        <div>
          <h1>{{ metadata().institution }}</h1>
          <p>{{ metadata().graduateOfficeTitle }}</p>
          <p class="rad-document__cycle">Relatorio de Atividades Docentes (RAD) - {{ metadata().cycleLabel }}</p>
        </div>
        <span class="rad-document__badge">{{ metadata().documentLabel }}</span>
      </header>

      <section class="rad-document__profile" aria-label="Dados do docente">
        <div>
          <h2>Nome do docente</h2>
          <p>{{ userData().name }}</p>
        </div>
        <div>
          <h2>Matricula SIAPE</h2>
          <p>{{ userData().siapeId }}</p>
        </div>
        <div>
          <h2>Departamento</h2>
          <p>{{ userData().department }}</p>
        </div>
        <div>
          <h2>Regime de trabalho</h2>
          <p>{{ userData().workRegime }}</p>
        </div>
        <div>
          <h2>Data de emissao</h2>
          <p>{{ metadata().issuedAtLabel }}</p>
        </div>
        <div>
          <h2>Status do ciclo</h2>
          <p class="rad-document__status">● {{ metadata().cycleStatus }}</p>
        </div>
      </section>

      <section class="rad-document__summary" aria-label="Quadro resumo de pontuacao">
        <h3>Quadro resumo de pontuacao</h3>
        <div class="rad-document__table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Categoria de atividade</th>
                <th scope="col">Horas</th>
                <th scope="col">Pontos obtidos</th>
                <th scope="col">Meta minima</th>
              </tr>
            </thead>
            <tbody>
              @for (item of summaryByCategory(); track item.category) {
                <tr>
                  <td>{{ item.displayLabel }}</td>
                  <td>{{ item.hours }}h</td>
                  <td>{{ item.points.toFixed(1) }}</td>
                  <td>{{ item.minimumTarget.toFixed(1) }}</td>
                </tr>
              }
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Total consolidado</th>
                <td>{{ totalHours() }}h</td>
                <td>{{ totalPoints().toFixed(1) }}</td>
                <td>{{ totalMinimumTarget().toFixed(1) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section class="rad-document__detail" aria-label="Detalhamento de atividades">
        <h3>Detalhamento de atividades</h3>
        @for (group of groupedActivities(); track group.category) {
          @if (group.items.length > 0) {
            <div class="rad-document__activity-group">
              <h4>{{ group.sectionTitle }}</h4>
              <ul>
                @for (activity of group.items; track activity.id) {
                  <li>
                    <div>
                      <p class="rad-document__activity-title">{{ activity.title }}</p>
                      <p class="rad-document__activity-description">{{ activity.description }}</p>
                    </div>
                    <span class="rad-document__activity-points">+{{ activity.score.toFixed(1) }} pts</span>
                  </li>
                }
              </ul>
            </div>
          }
        }
      </section>

      <footer class="rad-document__footer" aria-label="Assinaturas">
        <div class="rad-document__sign-block">
          <hr />
          <p>Assinatura do docente</p>
          <small>{{ userData().name }}</small>
        </div>
        <div class="rad-document__sign-block">
          <hr />
          <p>Coordenacao do departamento</p>
          <small>Carimbo e assinatura</small>
        </div>
      </footer>

      <p class="rad-document__legal">
        Documento gerado eletronicamente pela Plataforma Progressao. A autenticidade pode ser verificada mediante o codigo
        emitido no sistema institucional, quando disponivel.
      </p>
    </article>
  `,
  styleUrl: './rad-document.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadDocumentComponent {
  userData = input.required<ReportTeacherProfile>();
  metadata = input.required<ReportInstitutionMetadata>();
  activities = input.required<readonly ReportActivity[]>();

  private readonly approvedActivities = computed(() =>
    this.activities().filter((item) => item.status === 'APPROVED'),
  );

  protected readonly summaryByCategory = computed<readonly CategorySummaryRow[]>(() => {
    const base: Record<ActivityCategory, CategorySummaryRow> = {
      TEACHING: {
        category: 'TEACHING',
        displayLabel: 'Ensino',
        hours: 0,
        points: 0,
        minimumTarget: 80,
      },
      RESEARCH: {
        category: 'RESEARCH',
        displayLabel: 'Pesquisa',
        hours: 0,
        points: 0,
        minimumTarget: 60,
      },
      OUTREACH: {
        category: 'OUTREACH',
        displayLabel: 'Extensao',
        hours: 0,
        points: 0,
        minimumTarget: 20,
      },
      MANAGEMENT: {
        category: 'MANAGEMENT',
        displayLabel: 'Gestao',
        hours: 0,
        points: 0,
        minimumTarget: 20,
      },
    };

    for (const activity of this.approvedActivities()) {
      const previous = base[activity.category];
      base[activity.category] = {
        ...previous,
        hours: previous.hours + activity.workloadHours,
        points: previous.points + activity.score,
      };
    }

    return [base.TEACHING, base.RESEARCH, base.OUTREACH, base.MANAGEMENT];
  });

  protected readonly totalHours = computed(() =>
    this.summaryByCategory().reduce((sum, item) => sum + item.hours, 0),
  );

  protected readonly totalPoints = computed(() =>
    this.summaryByCategory().reduce((sum, item) => sum + item.points, 0),
  );

  protected readonly totalMinimumTarget = computed(() =>
    this.summaryByCategory().reduce((sum, item) => sum + item.minimumTarget, 0),
  );

  protected readonly groupedActivities = computed(() => {
    const sections: readonly { category: ActivityCategory; sectionTitle: string }[] = [
      { category: 'RESEARCH', sectionTitle: 'I. Pesquisa e publicacao' },
      { category: 'TEACHING', sectionTitle: 'II. Ensino' },
      { category: 'OUTREACH', sectionTitle: 'III. Extensao' },
      { category: 'MANAGEMENT', sectionTitle: 'IV. Gestao' },
    ];

    return sections.map((section) => ({
      category: section.category,
      sectionTitle: section.sectionTitle,
      items: this.approvedActivities().filter((item) => item.category === section.category),
    }));
  });
}
