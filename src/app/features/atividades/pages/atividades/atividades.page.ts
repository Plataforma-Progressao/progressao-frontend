import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

type AtividadeCategoria = 'Pesquisa' | 'Ensino' | 'Extensão' | 'Gestão';
type AtividadeStatus = 'Validado' | 'Pendente' | 'Erro';

interface AtividadeRow {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly categoria: AtividadeCategoria;
  readonly score: number;
  readonly status: AtividadeStatus;
}

const ALL_TABS = ['Todas Atividades', 'Ensino', 'Pesquisa', 'Extensão', 'Gestão'] as const;
type AtividadesTab = (typeof ALL_TABS)[number];

@Component({
  selector: 'app-atividades-page',
  imports: [MatIconModule],
  templateUrl: './atividades.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AtividadesPage {
  protected readonly tabs = ALL_TABS;
  protected readonly activeTab = signal<AtividadesTab>('Todas Atividades');

  protected readonly statusFilter = signal<'Todos' | AtividadeStatus>('Todos');
  protected readonly query = signal('');

  protected readonly pageIndex = signal(1);
  protected readonly totalPages = signal(3);
  protected readonly totalItems = signal(42);

  protected readonly rows = signal<readonly AtividadeRow[]>([
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

  protected tabButtonClass(tab: AtividadesTab): string {
    const base = 'relative -mb-px px-6 py-4 text-center text-sm leading-5 transition';
    if (this.activeTab() === tab) {
      return `${base} border-b-2 border-b-[color:var(--mat-sys-primary)] font-bold text-[color:var(--mat-sys-primary)]`;
    }

    return `${base} font-semibold text-[color:rgb(69_70_82)]`;
  }

  protected categoriaBadgeClass(categoria: AtividadeCategoria): string {
    const base = 'inline-flex items-center rounded px-2 py-1 text-[0.625rem] font-bold uppercase leading-3';
    switch (categoria) {
      case 'Pesquisa':
        return `${base} bg-[rgb(20,180,139)] text-white`;
      case 'Ensino':
        return `${base} bg-[rgb(90,84,234)] text-white`;
      case 'Extensão':
        return `${base} bg-[rgb(245,158,11)] text-white`;
      case 'Gestão':
        return `${base} bg-[rgb(156,163,175)] text-[color:rgb(26_28_29)]`;
    }
  }

  protected statusDotClass(status: AtividadeStatus): string {
    const base = 'inline-flex size-4 items-center justify-center rounded-full';
    switch (status) {
      case 'Validado':
        return `${base} bg-[color:rgb(0_83_18)]`;
      case 'Pendente':
        return `${base} bg-[color:rgb(65_68_103)]`;
      case 'Erro':
        return `${base} bg-[color:var(--mat-sys-error)]`;
    }
  }

  protected statusTextClass(status: AtividadeStatus): string {
    const base = 'text-sm font-medium';
    switch (status) {
      case 'Validado':
        return `${base} text-[color:rgb(0_83_18)]`;
      case 'Pendente':
        return `${base} text-[color:rgb(65_68_103)]`;
      case 'Erro':
        return `${base} text-[color:var(--mat-sys-error)]`;
    }
  }

  protected paginationButtonClass(page: number): string {
    const base = 'rounded px-3 py-1 text-xs font-bold';
    if (this.pageIndex() === page) {
      return `${base} bg-[color:var(--mat-sys-primary)] text-white`;
    }

    return `${base} text-[color:var(--mat-sys-on-surface)]`;
  }

  protected setTab(tab: AtividadesTab): void {
    this.activeTab.set(tab);
    this.pageIndex.set(1);
  }

  protected updateQuery(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.query.set(target?.value ?? '');
    this.pageIndex.set(1);
  }

  protected setStatusFilter(value: 'Todos' | AtividadeStatus): void {
    this.statusFilter.set(value);
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
}

