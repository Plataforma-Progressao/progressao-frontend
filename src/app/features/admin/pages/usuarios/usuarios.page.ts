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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, finalize, tap } from 'rxjs';
import { AdminApiService } from '../../admin-api.service';
import { AdminUserListItem, ROLE_LABELS } from '../../models/admin.models';
import { AuthRole } from '../../../../core/auth/auth.models';
import { BadgeComponent } from '../../../../shared/components/base/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { InputComponent } from '../../../../shared/components/base/input/input.component';
import { PaginationComponent } from '../../../../shared/components/base/pagination/pagination.component';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { AdminEditRolesDialogComponent } from './admin-edit-roles-dialog.component';

@Component({
  selector: 'app-admin-users-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    BadgeComponent,
    ButtonComponent,
    InputComponent,
    PaginationComponent,
  ],
  templateUrl: './usuarios.page.html',
  styleUrl: './usuarios.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsersPage {
  private readonly adminApi = inject(AdminApiService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly roleLabels = ROLE_LABELS;
  protected readonly loading = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly items = signal<readonly AdminUserListItem[]>([]);
  protected readonly total = signal(0);
  protected readonly page = signal(1);
  protected readonly pageSize = signal(10);
  protected readonly totalPages = signal(0);

  protected readonly queryControl = new FormControl('', { nonNullable: true });
  protected readonly roleControl = new FormControl<AuthRole | ''>('', {
    nonNullable: true,
  });

  private readonly queryFilter = toSignal(
    this.queryControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
    { initialValue: '' },
  );

  protected readonly displayedColumns = ['name', 'email', 'roles', 'department', 'actions'] as const;
  protected readonly isEmpty = computed(
    () => !this.loading() && !this.loadError() && this.items().length === 0,
  );

  constructor() {
    this.queryControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
      this.page.set(1);
      this.loadUsers();
    });
    this.roleControl.valueChanges.subscribe(() => {
      this.page.set(1);
      this.loadUsers();
    });
    this.loadUsers();
  }

  protected retry(): void {
    this.loadUsers();
  }

  protected onPageChange(nextPage: number): void {
    this.page.set(nextPage);
    this.loadUsers();
  }

  protected roleBadgeVariant(role: AuthRole): 'info' | 'success' | 'warning' | 'secondary' {
    switch (role) {
      case 'ADMIN':
        return 'warning';
      case 'EVALUATOR':
        return 'info';
      default:
        return 'success';
    }
  }

  protected roleLabel(role: AuthRole): string {
    return ROLE_LABELS[role];
  }

  protected openCreateUser(): void {
    void this.router.navigate(['/admin/usuarios/novo']);
  }

  protected editRoles(user: AdminUserListItem): void {
    const dialogRef = this.dialog.open(AdminEditRolesDialogComponent, {
      data: { user, roleLabels: ROLE_LABELS },
      width: '28rem',
      maxWidth: '95vw',
    });

    dialogRef.afterClosed().subscribe((roles: AuthRole[] | undefined) => {
      if (!roles) {
        return;
      }

      this.adminApi.updateRoles(user.id, { roles }).pipe(
        tap(() => {
          this.notificationService.success('Papéis atualizados com sucesso.');
          this.loadUsers();
        }),
        catchError((error: unknown) => {
          this.notificationService.error(this.resolveError(error));
          return EMPTY;
        }),
      ).subscribe();
    });
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.loadError.set(null);

    const roleFilter = this.roleControl.value;

    this.adminApi
      .listUsers({
        page: this.page(),
        pageSize: this.pageSize(),
        search: this.queryFilter() ?? '',
        ...(roleFilter ? { role: roleFilter } : {}),
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

    return 'Não foi possível carregar os usuários.';
  }
}
