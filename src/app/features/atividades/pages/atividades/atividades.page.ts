import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ActivitiesApiService } from '../../activities-api.service';
import { BadgeComponent } from '../../../../shared/components/base/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { InputComponent } from '../../../../shared/components/base/input/input.component';
import { StatusIndicatorComponent } from '../../../../shared/components/base/status-indicator/status-indicator.component';
import {
  ActivityListItemDto,
  ActivityListItemUi,
  ActivityStatusCode,
} from '../../models/activity-create.models';

type UiActivityCategory = 'Pesquisa' | 'Ensino' | 'Extensão' | 'Gestão';
type UiActivityStatus = 'Validado' | 'Pendente' | 'Erro';

interface ActivityListRow {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly categoria: UiActivityCategory;
  readonly score: number;
  readonly status: UiActivityStatus;
}

const ALL_TABS = ['Todas Atividades', 'Ensino', 'Pesquisa', 'Extensão', 'Gestão'] as const;
type ActivitiesListTab = (typeof ALL_TABS)[number];

const STATUS_OPTIONS: readonly { label: string; value: 'Todos' | UiActivityStatus }[] = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Validado', value: 'Validado' },
  { label: 'Pendente', value: 'Pendente' },
  { label: 'Erro', value: 'Erro' },
];

@Component({
  selector: 'app-activities-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    ButtonComponent,
    InputComponent,
    BadgeComponent,
    StatusIndicatorComponent,
  ],
  templateUrl: './atividades.page.html',
  styleUrls: ['./atividades.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesPage {
  private readonly activitiesApi = inject(ActivitiesApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly tabs = ALL_TABS;
  protected readonly statusOptions = STATUS_OPTIONS;

  protected readonly activeTab = signal<ActivitiesListTab>('Todas Atividades');

  protected readonly queryControl = new FormControl('', { nonNullable: true });
  protected readonly statusControl = new FormControl<'Todos' | UiActivityStatus>('Todos', {
    nonNullable: true,
  });

  protected readonly query = toSignal(this.queryControl.valueChanges, {
    initialValue: this.queryControl.value,
  });

  protected readonly statusFilter = toSignal(this.statusControl.valueChanges, {
    initialValue: this.statusControl.value,
  });

  protected readonly pageIndex = signal(1);
  protected readonly totalPages = signal(3);
  protected readonly loadingActivities = signal(true);
  protected readonly loadErrorMessage = signal<string | null>(null);
  protected readonly deletingActivityId = signal<string | null>(null);
  protected readonly totalItems = computed(() => this.activities().length);
  protected readonly displayedColumns = [
    'title',
    'categoria',
    'score',
    'status',
    'actions',
  ] as const;

  protected readonly activities = signal<readonly ActivityListItemUi[]>([]);

  private readonly resetPagination = effect(() => {
    this.query();
    this.statusFilter();
    this.pageIndex.set(1);
  });

  constructor() {
    this.loadActivities();
  }

  protected readonly filteredRows = computed(() => {
    const activeTab = this.activeTab();
    const query = this.query().trim().toLowerCase();
    const status = this.statusFilter();

    return this.activities().filter((row) => {
      if (activeTab !== 'Todas Atividades' && row.categoria !== activeTab) {
        return false;
      }

      if (status !== 'Todos' && row.status !== status) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        row.title.toLowerCase().includes(query) ||
        row.subtitle.toLowerCase().includes(query) ||
        row.categoria.toLowerCase().includes(query)
      );
    });
  });

  protected readonly isEmptyState = computed(
    () => !this.loadingActivities() && !this.loadErrorMessage() && this.filteredRows().length === 0,
  );

  protected readonly emptyStateTitle = computed(() => {
    if (
      this.activeTab() !== 'Todas Atividades' ||
      this.statusFilter() !== 'Todos' ||
      this.query().trim()
    ) {
      return 'Nenhuma atividade encontrada';
    }

    return 'Ainda não há atividades cadastradas';
  });

  protected readonly emptyStateDescription = computed(() => {
    if (
      this.activeTab() !== 'Todas Atividades' ||
      this.statusFilter() !== 'Todos' ||
      this.query().trim()
    ) {
      return 'Ajuste os filtros acima para ver outras atividades ou limpe a busca atual.';
    }

    return 'Adicione a primeira atividade para começar a acompanhar sua progressão funcional.';
  });

  protected tabButtonVariant(tab: ActivitiesListTab): 'secondary' | 'tertiary' {
    return this.activeTab() === tab ? 'secondary' : 'tertiary';
  }

  protected tabButtonCurrent(tab: ActivitiesListTab): string | null {
    return this.activeTab() === tab ? 'page' : null;
  }

  protected categoriaBadgeVariant(
    categoria: UiActivityCategory,
  ): 'success' | 'info' | 'warning' | 'secondary' {
    switch (categoria) {
      case 'Pesquisa':
        return 'success';
      case 'Ensino':
        return 'info';
      case 'Extensão':
        return 'warning';
      case 'Gestão':
        return 'secondary';
    }
  }

  protected statusToIndicatorStatus(status: UiActivityStatus): 'success' | 'pending' | 'error' {
    switch (status) {
      case 'Validado':
        return 'success';
      case 'Pendente':
        return 'pending';
      case 'Erro':
        return 'error';
    }
  }

  protected pageButtonVariant(page: number): 'secondary' | 'tertiary' {
    return this.pageIndex() === page ? 'secondary' : 'tertiary';
  }

  protected pageButtonCurrent(page: number): string | null {
    return this.pageIndex() === page ? 'page' : null;
  }

  protected setTab(tab: ActivitiesListTab): void {
    this.activeTab.set(tab);
    this.pageIndex.set(1);
  }

  protected previousPage(): void {
    this.pageIndex.update((current) => Math.max(1, current - 1));
  }

  protected nextPage(): void {
    this.pageIndex.update((current) => Math.min(this.totalPages(), current + 1));
  }

  protected goToPage(page: number): void {
    const clamped = Math.min(this.totalPages(), Math.max(1, page));
    this.pageIndex.set(clamped);
  }

  protected openCreateActivity(): void {
    void this.router.navigate(['/atividades/nova']);
  }

  protected openEditActivity(activityId: string): void {
    void this.router.navigate(['/atividades/editar', activityId]);
  }

  protected deleteActivity(activityId: string): void {
    const shouldDelete =
      typeof globalThis.confirm === 'function'
        ? globalThis.confirm('Deseja excluir esta atividade?')
        : true;

    if (!shouldDelete) {
      return;
    }

    this.deletingActivityId.set(activityId);

    this.activitiesApi
      .removeActivity(activityId)
      .pipe(
        catchError((error: unknown) => {
          this.snackBar.open(
            this.resolveHttpError(error, 'Não foi possível excluir a atividade.'),
            'Fechar',
            { duration: 4000 },
          );
          this.deletingActivityId.set(null);
          return EMPTY;
        }),
      )
      .subscribe(() => {
        this.activities.update((rows) => rows.filter((row) => row.id !== activityId));
        this.deletingActivityId.set(null);
        this.snackBar.open('Atividade excluída com sucesso.', 'Fechar', { duration: 3000 });
      });
  }

  protected retryLoadActivities(): void {
    this.loadActivities();
  }

  protected isDeleting(activityId: string): boolean {
    return this.deletingActivityId() === activityId;
  }

  private loadActivities(): void {
    this.loadingActivities.set(true);
    this.loadErrorMessage.set(null);

    this.activitiesApi
      .findAllActivities()
      .pipe(
        catchError((error: unknown) => {
          this.loadErrorMessage.set(
            this.resolveHttpError(error, 'Não foi possível carregar suas atividades.'),
          );
          this.loadingActivities.set(false);
          return EMPTY;
        }),
      )
      .subscribe((activities) => {
        this.activities.set(activities.map((activity) => this.toUiRow(activity)));
        this.loadingActivities.set(false);
      });
  }

  private toUiRow(activity: ActivityListItemDto): ActivityListItemUi {
    return {
      id: activity.id,
      title: activity.title,
      subtitle: this.buildSubtitle(activity),
      categoria: this.mapCategory(activity.category),
      score: activity.score,
      status: this.mapStatus(activity.status),
    };
  }

  private buildSubtitle(activity: ActivityListItemDto): string {
    const parts = [activity.kind, activity.term].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(' • ');
    }

    return activity.description;
  }

  private mapCategory(category: ActivityListItemDto['category']): ActivityListItemUi['categoria'] {
    switch (category) {
      case 'RESEARCH':
        return 'Pesquisa';
      case 'TEACHING':
        return 'Ensino';
      case 'OUTREACH':
        return 'Extensão';
      case 'MANAGEMENT':
        return 'Gestão';
    }
  }

  private mapStatus(status: ActivityStatusCode): ActivityListItemUi['status'] {
    switch (status) {
      case 'APPROVED':
        return 'Validado';
      case 'PENDING':
        return 'Pendente';
      case 'REJECTED':
        return 'Erro';
    }
  }

  private resolveHttpError(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }

    return fallback;
  }
}
