import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { BadgeComponent } from '../../../../shared/components/base/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { InputComponent } from '../../../../shared/components/base/input/input.component';
import { StatusIndicatorComponent } from '../../../../shared/components/base/status-indicator/status-indicator.component';

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

  protected readonly tabs = ALL_TABS;
  protected readonly statusOptions = STATUS_OPTIONS;

  protected readonly activeTab = signal<ActivitiesListTab>('Todas Atividades');

  protected readonly queryControl = new FormControl('', { nonNullable: true });
  protected readonly statusControl = new FormControl<'Todos' | UiActivityStatus>('Todos', { nonNullable: true });

  protected readonly query = toSignal(this.queryControl.valueChanges, {
    initialValue: this.queryControl.value,
  });

  protected readonly statusFilter = toSignal(this.statusControl.valueChanges, {
    initialValue: this.statusControl.value,
  });

  protected readonly pageIndex = signal(1);
  protected readonly totalPages = signal(3);
  protected readonly totalItems = signal(42);
  protected readonly displayedColumns = ['title', 'categoria', 'score', 'status', 'actions'] as const;

  protected readonly rows = signal<readonly ActivityListRow[]>([
    {
      id: 'artigo-deep-learning',
      title: 'Artigo: Deep Learning in Academic Workflows',
      subtitle: 'Periódico Q1 • ISSN 1234-5678',
      categoria: 'Pesquisa',
      score: 45.0,
      status: 'Validado',
    },
    {
      id: 'calculo-diferencial-60h',
      title: 'Cálculo Diferencial e Integral I (60h)',
      subtitle: 'Graduação • Turma A',
      categoria: 'Ensino',
      score: 20.0,
      status: 'Pendente',
    },
    {
      id: 'workshop-dados-publicos',
      title: 'Workshop: Curadoria de Dados Públicos',
      subtitle: 'Evento Comunitário',
      categoria: 'Extensão',
      score: 15.0,
      status: 'Erro',
    },
  ]);

  private readonly resetPagination = effect(() => {
    this.query();
    this.statusFilter();
    this.pageIndex.set(1);
  });

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

  protected tabButtonVariant(tab: ActivitiesListTab): 'secondary' | 'tertiary' {
    return this.activeTab() === tab ? 'secondary' : 'tertiary';
  }

  protected tabButtonCurrent(tab: ActivitiesListTab): string | null {
    return this.activeTab() === tab ? 'page' : null;
  }

  protected categoriaBadgeVariant(categoria: UiActivityCategory): 'success' | 'info' | 'warning' | 'secondary' {
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
}
