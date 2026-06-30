import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, finalize, firstValueFrom, tap } from 'rxjs';
import { EvaluatorApiService } from '../../evaluator-api.service';
import { EvaluatorActivityDetail } from '../../models/evaluator.models';
import { BadgeComponent } from '../../../../shared/components/base/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { ConfirmationDialogService } from '../../../../shared/components/base/confirmation-dialog/confirmation-dialog.service';
import { TextareaComponent } from '../../../../shared/components/base/textarea/textarea.component';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { StatusIndicatorComponent } from '../../../../shared/components/base/status-indicator/status-indicator.component';

@Component({
  selector: 'app-evaluator-review-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BadgeComponent,
    ButtonComponent,
    TextareaComponent,
    StatusIndicatorComponent,
  ],
  templateUrl: './revisao.page.html',
  styleUrl: './revisao.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluatorReviewPage {
  private readonly evaluatorApi = inject(EvaluatorApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly confirmationDialog = inject(ConfirmationDialogService);
  private readonly notificationService = inject(NotificationService);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly activity = signal<EvaluatorActivityDetail | null>(null);
  protected readonly showRejectForm = signal(false);

  protected readonly rejectReasonControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(2000)],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loadError.set('Atividade não encontrada.');
      this.loading.set(false);
      return;
    }

    this.evaluatorApi
      .getActivity(id)
      .pipe(
        tap((detail) => this.activity.set(detail)),
        catchError((error: unknown) => {
          this.loadError.set(this.resolveError(error));
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
  }

  protected getEvidenceUrl(evidenceId: string): string {
    return this.evaluatorApi.getEvidenceFileUrl(evidenceId);
  }

  protected async approve(): Promise<void> {
    const current = this.activity();
    if (!current || current.status !== 'PENDING') {
      return;
    }

    const confirmed = await firstValueFrom(
      this.confirmationDialog.open({
        title: 'Aprovar atividade',
        message: `Confirmar aprovação de "${current.title}"?`,
        confirmLabel: 'Aprovar',
        confirmVariant: 'primary',
        icon: 'check_circle',
      }),
    );

    if (!confirmed) {
      return;
    }

    this.saving.set(true);
    this.evaluatorApi
      .approve(current.id)
      .pipe(
        tap(() => {
          this.notificationService.success('Atividade aprovada com sucesso.');
          void this.router.navigate(['/avaliador/fila']);
        }),
        catchError((error: unknown) => {
          this.notificationService.error(this.resolveError(error));
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe();
  }

  protected async reject(): Promise<void> {
    const current = this.activity();
    if (!current || current.status !== 'PENDING') {
      return;
    }

    if (!this.showRejectForm()) {
      this.showRejectForm.set(true);
      return;
    }

    this.rejectReasonControl.markAsTouched();
    if (this.rejectReasonControl.invalid) {
      return;
    }

    this.saving.set(true);
    this.evaluatorApi
      .reject(current.id, {
        rejectionReason: this.rejectReasonControl.value.trim(),
      })
      .pipe(
        tap(() => {
          this.notificationService.success('Atividade rejeitada.');
          void this.router.navigate(['/avaliador/fila']);
        }),
        catchError((error: unknown) => {
          this.notificationService.error(this.resolveError(error));
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe();
  }

  protected categoryLabel(category: string): string {
    switch (category) {
      case 'TEACHING':
        return 'Ensino';
      case 'RESEARCH':
        return 'Pesquisa';
      case 'OUTREACH':
        return 'Extensão';
      case 'MANAGEMENT':
        return 'Gestão';
      default:
        return category;
    }
  }

  private resolveError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;
      if (typeof message === 'string' && message.trim()) {
        return message;
      }
    }

    return 'Não foi possível concluir a operação.';
  }
}
