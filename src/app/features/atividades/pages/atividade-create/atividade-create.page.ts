import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, distinctUntilChanged, EMPTY, firstValueFrom, map } from 'rxjs';
import { ActivitiesApiService } from '../../activities-api.service';
import {
  ActivityCategoryCode,
  ActivityCreatePayload,
  ActivityListItemDto,
  ActivityScoreEstimate,
} from '../../models/activity-create.models';

interface UploadItem {
  readonly localId: string;
  readonly fileName: string;
  readonly sizeBytes: number;
  readonly file: File;
  readonly status: 'queued' | 'uploading' | 'uploaded' | 'error';
  readonly serverId?: string;
}

interface CategoryOption {
  readonly label: string;
  readonly value: ActivityCategoryCode;
}

@Component({
  selector: 'app-activity-create-page',
  imports: [ReactiveFormsModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './atividade-create.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly activitiesApi = inject(ActivitiesApiService);
  private readonly estimateRequestToken = signal(0);

  protected readonly categoriaOptions: readonly CategoryOption[] = [
    { label: 'Ensino', value: 'TEACHING' },
    { label: 'Pesquisa', value: 'RESEARCH' },
    { label: 'Extensão', value: 'OUTREACH' },
    { label: 'Gestão', value: 'MANAGEMENT' },
  ];

  protected readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(160)]],
    categoria: ['' as ActivityCategoryCode | '', [Validators.required]],
    cargaHoraria: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
    descricao: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(1200)]],
  });

  protected readonly activityId = signal<string | null>(null);
  protected readonly uploads = signal<readonly UploadItem[]>([]);
  protected readonly dragging = signal(false);
  protected readonly isLoadingActivity = signal(false);
  protected readonly isEstimating = signal(false);
  protected readonly submitting = signal(false);
  protected readonly loadErrorMessage = signal<string | null>(null);
  protected readonly scoreEstimate = signal<ActivityScoreEstimate>({
    baseCategory: 15,
    workloadFactor: 2.5,
    totalImpact: 17.5,
    progressPercentage: 12,
  });

  protected readonly isEditing = computed(() => this.activityId() !== null);
  protected readonly pageTitle = computed(() =>
    this.isEditing() ? 'Editar Atividade Acadêmica' : 'Nova Atividade Acadêmica',
  );
  protected readonly pageDescription = computed(() =>
    this.isEditing()
      ? 'Atualize uma atividade já registrada e reenvie comprovantes quando necessário.'
      : 'Registre suas atividades de pesquisa, ensino ou extensão para o cálculo do progresso funcional.',
  );
  protected readonly submitLabel = computed(() =>
    this.isEditing() ? 'Salvar Alterações' : 'Confirmar Registro',
  );

  protected readonly scoreBarWidth = computed(
    () => `${Math.min(100, Math.max(0, this.scoreEstimate().progressPercentage))}%`,
  );

  protected readonly canSubmit = computed(() => {
    return !this.submitting() && !this.isLoadingActivity() && this.form.valid;
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.recomputeEstimate());

    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((activityId) => {
        this.activityId.set(activityId);

        if (activityId) {
          this.loadActivity(activityId);
          return;
        }

        this.loadErrorMessage.set(null);
        this.isLoadingActivity.set(false);
        this.form.reset(
          {
            titulo: '',
            categoria: '',
            cargaHoraria: 0,
            descricao: '',
          },
          { emitEvent: false },
        );
        this.uploads.set([]);
        this.recomputeEstimate();
      });
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) {
      return;
    }
    this.handleFiles(Array.from(files));
  }

  protected onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (!input?.files?.length) {
      return;
    }

    this.handleFiles(Array.from(input.files));
    input.value = '';
  }

  protected removeUpload(item: UploadItem): void {
    if (!item.serverId) {
      this.uploads.update((uploads) => uploads.filter((upload) => upload.localId !== item.localId));
      return;
    }

    this.activitiesApi
      .deleteEvidence(item.serverId)
      .pipe(catchError((error: unknown) => this.handleRemoveEvidenceError(error)))
      .subscribe(() => {
        this.uploads.update((uploads) =>
          uploads.filter((upload) => upload.localId !== item.localId),
        );
      });
  }

  protected cancel(): void {
    void this.router.navigate(['/atividades']);
  }

  protected async submit(): Promise<void> {
    if (!this.canSubmit()) {
      this.form.markAllAsTouched();
      this.snackBar.open('Revise os campos obrigatórios antes de confirmar o registro.', 'Fechar', {
        duration: 3500,
      });
      return;
    }

    const raw = this.form.getRawValue();
    const payload: ActivityCreatePayload = {
      title: raw.titulo.trim(),
      category: raw.categoria as ActivityCategoryCode,
      workloadHours: Math.trunc(raw.cargaHoraria),
      description: raw.descricao.trim(),
      score: this.scoreEstimate().totalImpact,
    };

    this.submitting.set(true);
    try {
      const activity = this.isEditing()
        ? await firstValueFrom(
            this.activitiesApi.updateActivity(this.activityId() as string, payload),
          )
        : await firstValueFrom(this.activitiesApi.createActivity(payload));
      const uploadResult = await this.uploadQueuedFiles(activity.id);

      if (uploadResult.hasFailures) {
        this.snackBar.open(
          'Atividade registrada, mas alguns comprovantes não puderam ser enviados.',
          'Fechar',
          { duration: 4500 },
        );
      } else {
        this.snackBar.open('Atividade registrada com sucesso.', 'Fechar', { duration: 3000 });
      }

      void this.router.navigate(['/atividades']);
    } catch (error: unknown) {
      const message = this.resolveHttpError(
        error,
        'Não foi possível confirmar o registro da atividade.',
      );
      this.snackBar.open(message, 'Fechar', { duration: 4500 });
    } finally {
      this.submitting.set(false);
    }
  }

  protected uploadStatusClass(status: UploadItem['status']): string {
    const base = 'text-[0.8125rem] leading-[1.125rem]';
    switch (status) {
      case 'queued':
        return `${base} text-[color:rgb(118_118_131)]`;
      case 'uploading':
        return `${base} text-[color:rgb(65_68_103)]`;
      case 'uploaded':
        return `${base} text-[#767683]`;
      case 'error':
        return `${base} text-[color:var(--mat-sys-error)]`;
      default:
        return `${base} text-[color:rgb(118_118_131)]`;
    }
  }

  protected uploadStatusLabel(status: UploadItem['status']): string {
    switch (status) {
      case 'queued':
        return 'Aguardando envio';
      case 'uploading':
        return 'Enviando...';
      case 'uploaded':
        return 'Enviado';
      case 'error':
        return 'Erro no envio';
      default:
        return 'Aguardando envio';
    }
  }

  private handleFiles(files: readonly File[]): void {
    const acceptedFiles = files.filter((file) => this.isAllowedFile(file));
    if (acceptedFiles.length === 0) {
      this.snackBar.open('Selecione arquivos PDF, PNG ou JPG com até 10MB.', 'Fechar', {
        duration: 4000,
      });
      return;
    }

    for (const file of acceptedFiles) {
      const localId = crypto.randomUUID();
      const pending: UploadItem = {
        localId,
        fileName: file.name,
        sizeBytes: file.size,
        file,
        status: 'queued',
      };

      this.uploads.update((uploads) => [...uploads, pending]);
    }
  }

  protected retryLoadActivity(): void {
    const activityId = this.activityId();
    if (!activityId) {
      return;
    }

    this.loadActivity(activityId);
  }

  private async uploadQueuedFiles(activityId: string): Promise<{ hasFailures: boolean }> {
    const queuedUploads = this.uploads().filter((upload) => upload.status === 'queued');
    if (queuedUploads.length === 0) {
      return { hasFailures: false };
    }

    let hasFailures = false;

    for (const upload of queuedUploads) {
      this.uploads.update((uploads) =>
        uploads.map((item) =>
          item.localId === upload.localId ? { ...item, status: 'uploading' } : item,
        ),
      );

      try {
        const response = await firstValueFrom(
          this.activitiesApi.uploadEvidence(activityId, upload.file),
        );

        this.uploads.update((uploads) =>
          uploads.map((item) =>
            item.localId === upload.localId
              ? {
                  ...item,
                  status: 'uploaded',
                  serverId: response.id,
                  fileName: response.originalName || response.filename,
                  sizeBytes: response.size || item.sizeBytes,
                }
              : item,
          ),
        );
      } catch {
        hasFailures = true;
        this.uploads.update((uploads) =>
          uploads.map((item) =>
            item.localId === upload.localId ? { ...item, status: 'error' } : item,
          ),
        );
      }
    }

    return { hasFailures };
  }

  private recomputeEstimate(): void {
    const category = this.form.controls.categoria.value;
    const cargaHoraria = Number(this.form.controls.cargaHoraria.value || 0);

    if (!category || cargaHoraria <= 0) {
      this.isEstimating.set(false);
      this.scoreEstimate.set({
        baseCategory: this.baseScoreForCategory(category as ActivityCategoryCode | ''),
        workloadFactor: 0,
        totalImpact: this.baseScoreForCategory(category as ActivityCategoryCode | ''),
        progressPercentage: 0,
      });
      return;
    }

    this.estimateRequestToken.update((token) => token + 1);
    const currentToken = this.estimateRequestToken();
    this.isEstimating.set(true);

    this.activitiesApi
      .estimateScore({ category, workloadHours: Math.trunc(cargaHoraria) })
      .pipe(
        catchError(() => {
          const fallback = this.calculateFallbackEstimate(category, cargaHoraria);
          if (this.estimateRequestToken() === currentToken) {
            this.scoreEstimate.set(fallback);
            this.isEstimating.set(false);
          }
          return EMPTY;
        }),
      )
      .subscribe((estimate) => {
        if (this.estimateRequestToken() !== currentToken) {
          return;
        }

        this.scoreEstimate.set(estimate);
        this.isEstimating.set(false);
      });
  }

  private loadActivity(activityId: string): void {
    this.isLoadingActivity.set(true);
    this.loadErrorMessage.set(null);

    this.activitiesApi
      .findActivityById(activityId)
      .pipe(
        catchError((error: unknown) => {
          this.loadErrorMessage.set(
            this.resolveHttpError(error, 'Não foi possível carregar os dados da atividade.'),
          );
          this.isLoadingActivity.set(false);
          return EMPTY;
        }),
      )
      .subscribe((activity) => {
        this.applyActivityToForm(activity);
        this.isLoadingActivity.set(false);
      });
  }

  private applyActivityToForm(activity: ActivityListItemDto): void {
    this.form.setValue(
      {
        titulo: activity.title,
        categoria: activity.category,
        cargaHoraria: activity.workloadHours,
        descricao: activity.description,
      },
      { emitEvent: false },
    );

    this.scoreEstimate.set({
      baseCategory: this.baseScoreForCategory(activity.category),
      workloadFactor: Math.max(0, Number((activity.workloadHours * 0.0625).toFixed(1))),
      totalImpact: Number(activity.score.toFixed(1)),
      progressPercentage: Math.min(100, Math.round((activity.score / 150) * 100)),
    });

    this.recomputeEstimate();
  }

  private handleRemoveEvidenceError(error: unknown) {
    const message = this.resolveHttpError(error, 'Falha ao remover comprovante no servidor.');
    this.snackBar.open(message, 'Fechar', { duration: 4000 });
    return EMPTY;
  }

  private calculateFallbackEstimate(
    categoria: ActivityCategoryCode,
    cargaHoraria: number,
  ): ActivityScoreEstimate {
    const baseCategory = this.baseScoreForCategory(categoria);
    const workloadFactor = Math.max(0, Number((cargaHoraria * 0.0625).toFixed(1)));
    const totalImpact = Number((baseCategory + workloadFactor).toFixed(1));
    const progressPercentage = Math.min(100, Math.round((totalImpact / 150) * 100));

    return {
      baseCategory,
      workloadFactor,
      totalImpact,
      progressPercentage,
    };
  }

  private baseScoreForCategory(categoria: ActivityCategoryCode | ''): number {
    switch (categoria) {
      case 'TEACHING':
        return 10;
      case 'RESEARCH':
        return 15;
      case 'OUTREACH':
        return 12;
      case 'MANAGEMENT':
        return 8;
      default:
        return 0;
    }
  }

  private isAllowedFile(file: File): boolean {
    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    return file.size <= maxSize && allowedTypes.includes(file.type);
  }

  private resolveHttpError(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    const apiMessage = error.error?.message;
    if (typeof apiMessage === 'string' && apiMessage.trim()) {
      return apiMessage;
    }

    return fallback;
  }
}
