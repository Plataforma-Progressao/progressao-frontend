import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { InputComponent } from '../../../../shared/components/base/input/input.component';
import { PaginationComponent } from '../../../../shared/components/base/pagination/pagination.component';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { AdminApiService } from '../../admin-api.service';
import {
  AdminUserListItem,
  EvaluatorAssignmentListItem,
} from '../../models/admin.models';

@Component({
  selector: 'app-admin-assignments-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule,
    InputComponent,
    PaginationComponent,
    ButtonComponent,
  ],
  templateUrl: './atribuicoes.page.html',
  styleUrl: './atribuicoes.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAssignmentsPage {
  private readonly adminApi = inject(AdminApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly displayedColumns = ['teacher', 'department', 'evaluator', 'actions'] as const;
  protected readonly items = signal<readonly EvaluatorAssignmentListItem[]>([]);
  protected readonly evaluators = signal<readonly AdminUserListItem[]>([]);
  protected readonly loading = signal(false);
  protected readonly savingTeacherId = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly total = signal(0);
  protected readonly totalPages = signal(0);

  protected readonly queryControl = new FormControl('', { nonNullable: true });
  protected readonly unassignedControl = new FormControl(false, { nonNullable: true });

  constructor() {
    const unassigned = this.route.snapshot.queryParamMap.get('unassigned') === 'true';
    if (unassigned) {
      this.unassignedControl.setValue(true);
    }

    this.queryControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.page.set(1);
        this.loadAssignments();
      });

    this.unassignedControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.page.set(1);
        this.loadAssignments();
      });

    this.loadEvaluators();
    this.loadAssignments();
  }

  protected retry(): void {
    this.loadAssignments();
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
    this.loadAssignments();
  }

  protected onEvaluatorChange(teacherId: string, evaluatorId: string): void {
    if (!evaluatorId) {
      this.unassign(teacherId);
      return;
    }

    this.assign(teacherId, evaluatorId);
  }

  protected assign(teacherId: string, evaluatorId: string): void {
    this.savingTeacherId.set(teacherId);
    this.adminApi
      .assignEvaluator(teacherId, { evaluatorId })
      .pipe(finalize(() => this.savingTeacherId.set(null)))
      .subscribe({
        next: () => this.loadAssignments(),
        error: () => this.loadError.set('Não foi possível atribuir o revisor.'),
      });
  }

  protected unassign(teacherId: string): void {
    this.savingTeacherId.set(teacherId);
    this.adminApi
      .unassignEvaluator(teacherId)
      .pipe(finalize(() => this.savingTeacherId.set(null)))
      .subscribe({
        next: () => this.loadAssignments(),
        error: () => this.loadError.set('Não foi possível remover a atribuição.'),
      });
  }

  protected isSaving(teacherId: string): boolean {
    return this.savingTeacherId() === teacherId;
  }

  private loadEvaluators(): void {
    this.adminApi
      .listUsers({ page: 1, pageSize: 100, role: 'EVALUATOR' })
      .subscribe({
        next: (response) => this.evaluators.set(response.items),
      });
  }

  private loadAssignments(): void {
    this.loading.set(true);
    this.loadError.set(null);

    this.adminApi
      .listAssignments({
        page: this.page(),
        pageSize: this.pageSize(),
        search: this.queryControl.value,
        unassignedOnly: this.unassignedControl.value,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.items.set(response.items);
          this.total.set(response.total);
          this.page.set(response.page);
          this.pageSize.set(response.pageSize);
          this.totalPages.set(response.totalPages);
        },
        error: () => this.loadError.set('Não foi possível carregar as atribuições.'),
      });
  }
}
