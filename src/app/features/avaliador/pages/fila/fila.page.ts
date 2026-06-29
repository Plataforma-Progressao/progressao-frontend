import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { EvaluatorApiService } from '../../evaluator-api.service';
import { EvaluatorActivityQueueItem } from '../../models/evaluator.models';
import { ActivityCategoryCode } from '../../../atividades/models/activity-create.models';
import { BadgeComponent } from '../../../../shared/components/base/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { InputComponent } from '../../../../shared/components/base/input/input.component';
import { PaginationComponent } from '../../../../shared/components/base/pagination/pagination.component';
import { StatusIndicatorComponent } from '../../../../shared/components/base/status-indicator/status-indicator.component';

@Component({
  selector: 'app-evaluator-queue-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    BadgeComponent,
    ButtonComponent,
    InputComponent,
    PaginationComponent,
    StatusIndicatorComponent,
  ],
  templateUrl: './fila.page.html',
  styleUrl: './fila.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluatorQueuePage {
  private readonly evaluatorApi = inject(EvaluatorApiService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly items = signal<readonly EvaluatorActivityQueueItem[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly totalPages = signal(0);

  protected readonly queryControl = new FormControl('', { nonNullable: true });
  protected readonly statusControl = new FormControl<'PENDING' | 'APPROVED' | 'REJECTED'>(
    'PENDING',
    { nonNullable: true },
  );

  private readonly queryFilter = toSignal(
    this.queryControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );
  private readonly statusFilter = toSignal(this.statusControl.valueChanges, {
    initialValue: this.statusControl.value,
  });

  protected readonly displayedColumns = [
    'teacher',
    'title',
    'categoria',
    'score',
    'status',
    'actions',
  ] as const;

  protected readonly isEmpty = computed(
    () => !this.loading() && !this.loadError() && this.items().length === 0,
  );

  constructor() {
    this.queryControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.page.set(1);
      this.loadQueue();
    });
    this.statusControl.valueChanges.subscribe(() => {
      this.page.set(1);
      this.loadQueue();
    });
    this.loadQueue();
  }

  protected retry(): void {
    this.loadQueue();
  }

  protected onPageChange(nextPage: number): void {
    this.page.set(nextPage);
    this.loadQueue();
  }

  protected openReview(item: EvaluatorActivityQueueItem): void {
    void this.router.navigate(['/avaliador/atividades', item.id]);
  }

  protected categoryLabel(category: ActivityCategoryCode): string {
    switch (category) {
      case 'TEACHING':
        return 'Ensino';
      case 'RESEARCH':
        return 'Pesquisa';
      case 'OUTREACH':
        return 'Extensão';
      case 'MANAGEMENT':
        return 'Gestão';
    }
  }

  protected categoryVariant(
    category: ActivityCategoryCode,
  ): 'info' | 'success' | 'warning' | 'secondary' {
    switch (category) {
      case 'TEACHING':
        return 'info';
      case 'RESEARCH':
        return 'success';
      case 'OUTREACH':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  protected statusIndicator(status: string): 'success' | 'pending' | 'error' {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'pending';
    }
  }

  protected statusLabel(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'Aprovado';
      case 'REJECTED':
        return 'Rejeitado';
      default:
        return 'Pendente';
    }
  }

  private loadQueue(): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.evaluatorApi
      .listActivities({
        page: this.page(),
        pageSize: this.pageSize(),
        search: this.queryFilter() ?? '',
        status: this.statusFilter(),
      })
      .pipe(
        tap((response) => {
          this.items.set(response.items);
          this.total.set(response.total);
          this.page.set(response.page);
          this.pageSize.set(response.pageSize);
          this.totalPages.set(response.totalPages);
        }),
        catchError((error: unknown) => {
          this.loadError.set(this.resolveError(error));
          this.items.set([]);
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  private resolveError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }

    return 'Não foi possível carregar a fila de avaliação.';
  }
}
