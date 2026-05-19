import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY, catchError, firstValueFrom } from 'rxjs';
import { ActivitiesApiService } from '../../activities-api.service';
import {
  ActivityCategoryCode,
  ActivityCreatePayload,
  ActivityListItem,
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
  private readonly destroyRef = inject(DestroyRef);

  private readonly activityId = this.route.snapshot.paramMap.get('id');

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

  protected readonly uploads = signal<readonly UploadItem[]>([]);
  protected readonly dragging = signal(false);
  protected readonly submitting = signal(false);
  protected readonly loadingActivity = signal(false);
  protected readonly loadErrorMessage = signal<string | null>(null);
  protected readonly scoreEstimate = signal<ActivityScoreEstimate>({
    baseCategory: 15,
    workloadFactor: 2.5,
    totalImpact: 17.5,
    progressPercentage: 12,
  });

  protected readonly isEditMode = computed(() => Boolean(this.activityId));
  protected readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Editar Atividade Acadêmica' : 'Nova Atividade Acadêmica',
  );
  protected readonly pageDescription = computed(() =>
    this.isEditMode()
      ? 'Atualize os dados da atividade e reenvie comprovantes, se necessário.'
      : 'Registre suas atividades de pesquisa, ensino ou extensão para o cálculo do progresso funcional.',
  );
  protected readonly submitLabel = computed(() =>
    this.loadingActivity()
      ? 'Carregando...'
      : this.submitting()
        ? 'Salvando...'
        : this.isEditMode()
          ? 'Salvar Alterações'
          : 'Confirmar Registro',
  );

  protected readonly isFormLocked = computed(
    () => this.loadingActivity() || this.submitting() || Boolean(this.loadErrorMessage()),
  );

  protected readonly scoreBarWidth = computed(
    () => `${Math.min(100, Math.max(0, this.scoreEstimate().progressPercentage))}%`,
  );

  protected readonly canSubmit = computed(() => {
    if (this.isFormLocked() || this.form.invalid || this.loadErrorMessage()) {
      return false;
    }

    return this.uploads().every((upload) => upload.status !== 'error');
  });

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.recomputeEstimate());

    if (this.activityId) {
      void this.loadActivity(this.activityId);
    }
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
    this.uploads.update((uploads) => uploads.filter((upload) => upload.localId !== item.localId));
  }

  protected cancel(): void {
    void this.router.navigate(['/atividades']);
  }

  protected retryLoadActivity(): void {
    if (!this.activityId) {
      return;
    }

    void this.loadActivity(this.activityId);
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
      workloadHours: raw.cargaHoraria,
      description: raw.descricao.trim(),
    };

    this.submitting.set(true);

    try {
      const activity = this.activityId
        ? await firstValueFrom(this.activitiesApi.updateActivity(this.activityId, payload))
        : await firstValueFrom(this.activitiesApi.createActivity(payload));

      await this.uploadQueuedFiles(activity);

      this.snackBar.open(
        this.activityId ? 'Atividade atualizada com sucesso.' : 'Atividade registrada com sucesso.',
        'Fechar',
        { duration: 3000 },
      );
      void this.router.navigate(['/atividades']);
    } catch (error: unknown) {
      const message = this.resolveHttpError(
        error,
        this.activityId
          ? 'Não foi possível salvar as alterações da atividade.'
          : 'Não foi possível confirmar o registro da atividade.',
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
    }
  }

  protected uploadStatusLabel(status: UploadItem['status']): string {
    switch (status) {
      case 'queued':
        return 'Pronto para envio';
      case 'uploading':
        return 'Enviando...';
      case 'uploaded':
        return 'Enviado';
      case 'error':
        return 'Erro no envio';
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

  private recomputeEstimate(): void {
    const categoria = this.form.controls.categoria.value;
    const cargaHoraria = Number(this.form.controls.cargaHoraria.value || 0);

    if (!categoria || cargaHoraria <= 0) {
      this.scoreEstimate.set({
        baseCategory: this.baseScoreForCategory(categoria as ActivityCategoryCode | ''),
        workloadFactor: 0,
        totalImpact: this.baseScoreForCategory(categoria as ActivityCategoryCode | ''),
        progressPercentage: 0,
      });
      return;
    }

    this.activitiesApi
      .estimateScore({ category: categoria, workloadHours: cargaHoraria })
      .pipe(
        catchError(() => {
          const fallback = this.calculateFallbackEstimate(categoria, cargaHoraria);
          this.scoreEstimate.set(fallback);
          return EMPTY;
        }),
      )
      .subscribe((estimate) => this.scoreEstimate.set(estimate));
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

    const apiMessage = this.extractErrorMessage(error.error);
    if (apiMessage) {
      return apiMessage;
    }

    return fallback;
  }

  private async loadActivity(activityId: string): Promise<void> {
    this.loadingActivity.set(true);
    this.loadErrorMessage.set(null);

    try {
      const activity = await firstValueFrom(this.activitiesApi.getActivity(activityId));
      this.patchForm(activity);
    } catch (error: unknown) {
      this.loadErrorMessage.set(
        this.resolveHttpError(error, 'Não foi possível carregar a atividade para edição.'),
      );
    } finally {
      this.loadingActivity.set(false);
    }
  }

  private extractErrorMessage(payload: unknown): string | null {
    if (typeof payload === 'string' && payload.trim()) {
      return payload.trim();
    }

    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>;

      const directMessage = record['message'];
      if (typeof directMessage === 'string' && directMessage.trim()) {
        return directMessage.trim();
      }

      const nestedError = record['error'];
      if (nestedError && typeof nestedError === 'object') {
        const nestedRecord = nestedError as Record<string, unknown>;
        const nestedMessage = nestedRecord['message'];
        if (typeof nestedMessage === 'string' && nestedMessage.trim()) {
          return nestedMessage.trim();
        }
      }
    }

    return null;
  }

  private patchForm(activity: ActivityListItem): void {
    this.form.patchValue({
      titulo: activity.title,
      categoria: activity.category,
      cargaHoraria: activity.workloadHours,
      descricao: activity.description,
    });
  }

  private async uploadQueuedFiles(activity: ActivityListItem): Promise<void> {
    for (const upload of this.uploads().filter((item) => item.status === 'queued')) {
      this.uploads.update((current) =>
        current.map((item) =>
          item.localId === upload.localId ? { ...item, status: 'uploading' } : item,
        ),
      );

      try {
        const response = await firstValueFrom(
          this.activitiesApi.uploadEvidence(activity.id, upload.file),
        );
        this.uploads.update((current) =>
          current.map((item) =>
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
        this.uploads.update((current) =>
          current.map((item) =>
            item.localId === upload.localId ? { ...item, status: 'error' } : item,
          ),
        );
        this.snackBar.open(`Falha ao enviar "${upload.fileName}".`, 'Fechar', { duration: 4000 });
      }
    }
  }
}
