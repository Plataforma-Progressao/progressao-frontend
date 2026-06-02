import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  resource,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ChecklistApiService } from '../../checklist-api.service';
import {
  ChecklistHomeItem,
  ChecklistItemStatusCode,
} from '../../models/checklist.models';

type UiChecklistStatus = 'Concluído' | 'Atenção' | 'Pendente';

const STATUS_TO_UI: Record<ChecklistItemStatusCode, UiChecklistStatus> = {
  COMPLETED: 'Concluído',
  ATTENTION: 'Atenção',
  PENDING: 'Pendente',
};

const UI_TO_STATUS: Record<UiChecklistStatus, ChecklistItemStatusCode> = {
  Concluído: 'COMPLETED',
  Atenção: 'ATTENTION',
  Pendente: 'PENDING',
};

@Component({
  selector: 'app-checklist-home',
  templateUrl: './checklist-home.page.html',
  styleUrls: ['./checklist-home.page.scss'],
  imports: [MatIconModule, MatMenuModule, MatMenuTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecklistHomePage {
  private readonly checklistApi = inject(ChecklistApiService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly statusFilter = signal<'Todos' | UiChecklistStatus>('Todos');
  protected readonly updatingItemId = signal<string | null>(null);

  protected readonly checklistResource = resource({
    loader: () => firstValueFrom(this.checklistApi.getHome()),
  });

  protected readonly isLoading = computed(() => this.checklistResource.status() === 'loading');
  protected readonly hasError = computed(() => this.checklistResource.status() === 'error');
  protected readonly homeData = computed(() => this.checklistResource.value());

  protected readonly totalDocs = computed(() => this.homeData()?.total ?? 0);
  protected readonly concluidos = computed(() => this.homeData()?.completed ?? 0);
  protected readonly atencao = computed(() => this.homeData()?.attention ?? 0);
  protected readonly pendentes = computed(() => this.homeData()?.pending ?? 0);
  protected readonly percentConcluido = computed(
    () => this.homeData()?.completionPercentage ?? 0,
  );
  protected readonly percentAtencao = computed(() => {
    const total = this.totalDocs();
    return total > 0 ? (this.atencao() / total) * 100 : 0;
  });
  protected readonly percentPendente = computed(() => {
    const total = this.totalDocs();
    return total > 0 ? (this.pendentes() / total) * 100 : 0;
  });

  protected readonly documentos = computed(() => {
    const items = this.homeData()?.items ?? [];
    const filtro = this.statusFilter();

    if (filtro === 'Todos') {
      return items;
    }

    const statusCode = UI_TO_STATUS[filtro];
    return items.filter((item) => item.status === statusCode);
  });

  protected filtrarDocumentos(filtro: 'Todos' | UiChecklistStatus): void {
    this.statusFilter.set(filtro);
  }

  protected uiStatus(item: ChecklistHomeItem): UiChecklistStatus {
    return STATUS_TO_UI[item.status];
  }

  protected statusClass(status: UiChecklistStatus): string {
    return `checklist__doc-item--${status.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')}`;
  }

  protected descClass(status: UiChecklistStatus): string {
    return `text--${status.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')}`;
  }

  protected formatSubmittedAt(iso: string | null): string {
    if (!iso) {
      return '';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(new Date(iso));
  }

  protected markAsCompleted(item: ChecklistHomeItem): void {
    void this.updateStatus(item, 'COMPLETED');
  }

  protected markAsAttention(item: ChecklistHomeItem): void {
    void this.updateStatus(item, 'ATTENTION');
  }

  protected reload(): void {
    this.checklistResource.reload();
  }

  private async updateStatus(
    item: ChecklistHomeItem,
    status: ChecklistItemStatusCode,
  ): Promise<void> {
    if (item.status === status) {
      return;
    }

    this.updatingItemId.set(item.id);

    try {
      await firstValueFrom(this.checklistApi.updateItem(item.id, { status }));
      this.checklistResource.reload();
      this.snackBar.open('Status do documento atualizado.', 'Fechar', { duration: 3000 });
    } catch {
      this.snackBar.open('Não foi possível atualizar o documento.', 'Fechar', {
        duration: 4000,
      });
    } finally {
      this.updatingItemId.set(null);
    }
  }
}
