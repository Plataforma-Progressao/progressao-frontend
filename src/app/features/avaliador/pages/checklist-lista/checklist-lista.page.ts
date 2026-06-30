import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, finalize, tap } from 'rxjs';
import { EvaluatorApiService } from '../../evaluator-api.service';
import { EvaluatorChecklistListItem } from '../../models/evaluator.models';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { InputComponent } from '../../../../shared/components/base/input/input.component';
import { StatusIndicatorComponent } from '../../../../shared/components/base/status-indicator/status-indicator.component';

@Component({
  selector: 'app-evaluator-checklist-list-page',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    ButtonComponent,
    InputComponent,
    StatusIndicatorComponent,
  ],
  templateUrl: './checklist-lista.page.html',
  styleUrl: './checklist-lista.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluatorChecklistListPage {
  private readonly evaluatorApi = inject(EvaluatorApiService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly items = signal<readonly EvaluatorChecklistListItem[]>([]);

  protected readonly queryControl = new FormControl('', { nonNullable: true });
  protected readonly statusControl = new FormControl<'PENDING' | 'ATTENTION' | 'COMPLETED' | ''>(
    '',
    { nonNullable: true },
  );

  protected readonly displayedColumns = ['teacher', 'item', 'status', 'submittedAt', 'actions'] as const;

  protected readonly filteredItems = computed(() => {
    const query = this.queryControl.value.trim().toLowerCase();
    const items = this.items();

    if (!query) {
      return items;
    }

    return items.filter(
      (item) =>
        item.teacher.name.toLowerCase().includes(query) ||
        item.teacher.email.toLowerCase().includes(query) ||
        item.template.title.toLowerCase().includes(query),
    );
  });

  protected readonly isEmpty = computed(
    () => !this.loading() && !this.loadError() && this.filteredItems().length === 0,
  );

  constructor() {
    this.queryControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe();
    this.statusControl.valueChanges.subscribe(() => this.loadChecklist());
    this.loadChecklist();
  }

  protected retry(): void {
    this.loadChecklist();
  }

  protected openReview(item: EvaluatorChecklistListItem): void {
    void this.router.navigate(['/avaliador/checklist', item.id]);
  }

  protected statusIndicator(status: string): 'success' | 'pending' | 'error' {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'ATTENTION':
        return 'error';
      default:
        return 'pending';
    }
  }

  protected statusLabel(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'Concluído';
      case 'ATTENTION':
        return 'Atenção';
      default:
        return 'Pendente';
    }
  }

  private loadChecklist(): void {
    this.loading.set(true);
    this.loadError.set(null);

    const status = this.statusControl.value;

    this.evaluatorApi
      .listChecklist({
        ...(status ? { status } : {}),
      })
      .pipe(
        tap((response) => this.items.set(response)),
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

    return 'Não foi possível carregar o checklist dos docentes.';
  }
}
