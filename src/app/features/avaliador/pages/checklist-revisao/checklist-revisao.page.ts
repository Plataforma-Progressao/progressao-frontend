import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, finalize, firstValueFrom, tap } from 'rxjs';
import { EvaluatorApiService } from '../../evaluator-api.service';
import { EvaluatorChecklistDetail } from '../../models/evaluator.models';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { ConfirmationDialogService } from '../../../../shared/components/base/confirmation-dialog/confirmation-dialog.service';
import { TextareaComponent } from '../../../../shared/components/base/textarea/textarea.component';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { StatusIndicatorComponent } from '../../../../shared/components/base/status-indicator/status-indicator.component';

@Component({
  selector: 'app-evaluator-checklist-review-page',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ButtonComponent,
    TextareaComponent,
    StatusIndicatorComponent,
  ],
  templateUrl: './checklist-revisao.page.html',
  styleUrl: './checklist-revisao.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluatorChecklistReviewPage {
  private readonly evaluatorApi = inject(EvaluatorApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly confirmationDialog = inject(ConfirmationDialogService);
  private readonly notificationService = inject(NotificationService);

  protected readonly loading = signal(true);
  protected readonly saving = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly item = signal<EvaluatorChecklistDetail | null>(null);
  protected readonly showRejectForm = signal(false);

  protected readonly rejectReasonControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(4), Validators.maxLength(2000)],
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loadError.set('Item de checklist não encontrado.');
      this.loading.set(false);
      return;
    }

    this.evaluatorApi
      .getChecklistItem(id)
      .pipe(
        tap((detail) => this.item.set(detail)),
        catchError((error: unknown) => {
          this.loadError.set(this.resolveError(error));
          return EMPTY;
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe();
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

  protected canReview(): boolean {
    const current = this.item();
    return current?.status === 'PENDING' || current?.status === 'ATTENTION';
  }

  protected async approve(): Promise<void> {
    const current = this.item();
    if (!current || !this.canReview()) {
      return;
    }

    const confirmed = await firstValueFrom(
      this.confirmationDialog.open({
        title: 'Aprovar item',
        message: `Confirmar aprovação de "${current.template.title}"?`,
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
      .approveChecklistItem(current.id)
      .pipe(
        tap(() => {
          this.notificationService.success('Item aprovado com sucesso.');
          void this.router.navigate(['/avaliador/checklist']);
        }),
        catchError((error: unknown) => {
          this.notificationService.error(this.resolveError(error));
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe();
  }

  protected reject(): void {
    this.showRejectForm.set(true);
  }

  protected async confirmReject(): Promise<void> {
    const current = this.item();
    if (!current || !this.canReview()) {
      return;
    }

    if (this.rejectReasonControl.invalid) {
      this.rejectReasonControl.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.evaluatorApi
      .rejectChecklistItem(current.id, { note: this.rejectReasonControl.value.trim() })
      .pipe(
        tap(() => {
          this.notificationService.success('Item devolvido ao docente.');
          void this.router.navigate(['/avaliador/checklist']);
        }),
        catchError((error: unknown) => {
          this.notificationService.error(this.resolveError(error));
          return EMPTY;
        }),
        finalize(() => this.saving.set(false)),
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

    return 'Não foi possível processar a revisão do checklist.';
  }
}
