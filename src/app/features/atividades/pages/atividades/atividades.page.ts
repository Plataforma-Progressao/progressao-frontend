import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ActivitiesApiService } from '../../activities-api.service';
import { ActivityListItem } from '../../models/activity-create.models';
import { BadgeComponent } from '../../../../shared/components/base/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { InputComponent } from '../../../../shared/components/base/input/input.component';
import { StatusIndicatorComponent } from '../../../../shared/components/base/status-indicator/status-indicator.component';

type UiActivityCategory = 'Pesquisa' | 'Ensino' | 'Extensão' | 'Gestão';
type UiActivityStatus = 'Rascunho' | 'Validado' | 'Pendente' | 'Erro';

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
  private readonly router = inject(Router);
  private readonly activitiesApiService = inject(ActivitiesApiService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

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
  protected readonly totalItems = signal(0);
  protected readonly loadingActivities = signal(false);
  protected readonly loadErrorMessage = signal<string | null>(null);
  protected readonly displayedColumns = [
    'title',
    'categoria',
    'score',
    'status',
    'actions',
  ] as const;

  protected readonly rows = signal<readonly ActivityListRow[]>([]);

  constructor() {
    this.loadActivities();
  }

  protected readonly filteredRows = computed(() => {
    const activeTab = this.activeTab();
    const query = this.query().trim().toLowerCase();
    const status = this.statusFilter();

    return this.rows().filter((row) => {
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
    () => !this.loadingActivities() && this.rows().length === 0,
  );

  protected readonly emptyStateTitle = computed(() =>
    this.rows().length === 0 ? 'Nenhuma atividade cadastrada' : 'Nenhuma atividade encontrada',
  );

  protected readonly emptyStateDescription = computed(() =>
    this.rows().length === 0
      ? 'Cadastre sua primeira atividade para começar a acompanhar a progressão funcional.'
      : 'Ajuste a busca ou os filtros para encontrar atividades registradas anteriormente.',
  );

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
      case 'Rascunho':
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

  protected retryLoadActivities(): void {
    this.loadActivities();
  }

  protected openEditActivity(activityId: string): void {
    void this.router.navigate(['/atividades/editar', activityId]);
  }

  protected deleteActivity(activityId: string): void {
    this.activitiesApiService
      .deleteActivity(activityId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.rows.update((rows) => rows.filter((row) => row.id !== activityId));
          this.totalItems.set(this.rows().length);
          this.totalPages.set(Math.max(1, Math.ceil(this.rows().length / 10)));
          this.snackBar.open('Atividade removida com sucesso.', 'Fechar', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Não foi possível remover a atividade.', 'Fechar', { duration: 4000 });
        },
      });
  }

  private loadActivities(): void {
    this.loadingActivities.set(true);
    this.loadErrorMessage.set(null);

    this.activitiesApiService
      .getActivities()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loadingActivities.set(false)),
      )
      .subscribe({
        next: (activities) => {
          const mapped = activities.map((activity) => this.mapActivity(activity));
          this.rows.set(mapped);
          this.totalItems.set(mapped.length);
          this.totalPages.set(Math.max(1, Math.ceil(mapped.length / 10)));
        },
        error: () => {
          this.loadErrorMessage.set('Não foi possível carregar as atividades no momento.');
        },
      });
  }

  private mapActivity(activity: ActivityListItem): ActivityListRow {
    return {
      id: activity.id,
      title: activity.title,
      subtitle: activity.description,
      categoria: this.mapCategoryLabel(activity.category),
      score: activity.score,
      status: this.mapStatusLabel(activity.status),
    };
  }

  private mapCategoryLabel(category: ActivityListItem['category']): UiActivityCategory {
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

  private mapStatusLabel(status: ActivityListItem['status']): UiActivityStatus {
    switch (status) {
      case 'DRAFT':
        return 'Rascunho';
      case 'PENDING':
        return 'Pendente';
      case 'APPROVED':
        return 'Validado';
      case 'REJECTED':
        return 'Erro';
    }
  }
}
