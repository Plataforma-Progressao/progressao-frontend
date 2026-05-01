import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { ActivitiesApiService } from '../../activities-api.service';
import {
  ActivityCategoryCode,
  ActivityCreatePayload,
  ActivityScoreEstimate,
} from '../../models/activity-create.models';

interface UploadItem {
  readonly localId: string;
  readonly fileName: string;
  readonly sizeBytes: number;
  readonly status: 'uploading' | 'uploaded' | 'error';
  readonly serverId?: string;
}

interface CategoryOption {
  readonly label: string;
  readonly value: ActivityCategoryCode;
}

@Component({
  selector: 'app-activity-create-page',
  imports: [ReactiveFormsModule, MatIconModule, RouterLink],
  templateUrl: './atividade-create.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly activitiesApi = inject(ActivitiesApiService);

  protected readonly categoriaOptions: readonly CategoryOption[] = [
    { label: 'Ensino', value: 'ENSINO' },
    { label: 'Pesquisa', value: 'PESQUISA' },
    { label: 'Extensão', value: 'EXTENSAO' },
    { label: 'Gestão', value: 'GESTAO' },
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
  protected readonly scoreEstimate = signal<ActivityScoreEstimate>({
    baseCategoria: 15,
    fatorCargaHoraria: 2.5,
    impactoTotal: 17.5,
    percentualMeta: 12,
  });

  protected readonly scoreBarWidth = computed(() =>
    `${Math.min(100, Math.max(0, this.scoreEstimate().percentualMeta))}%`,
  );

  protected readonly canSubmit = computed(() => {
    if (this.submitting() || this.form.invalid) {
      return false;
    }

    return this.uploads().every((upload) => upload.status === 'uploaded');
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.recomputeEstimate());
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

    if (!item.serverId) {
      return;
    }

    this.activitiesApi
      .deleteEvidence(item.serverId)
      .pipe(
        catchError(() => {
          this.snackBar.open('Falha ao remover comprovante no servidor.', 'Fechar', { duration: 4000 });
          return EMPTY;
        }),
      )
      .subscribe();
  }

  protected cancel(): void {
    void this.router.navigate(['/atividades']);
  }

  protected submit(): void {
    if (!this.canSubmit()) {
      this.form.markAllAsTouched();
      this.snackBar.open('Revise os campos obrigatórios antes de confirmar o registro.', 'Fechar', {
        duration: 3500,
      });
      return;
    }

    const raw = this.form.getRawValue();
    const payload: ActivityCreatePayload = {
      titulo: raw.titulo.trim(),
      categoria: raw.categoria as ActivityCategoryCode,
      cargaHoraria: raw.cargaHoraria,
      descricao: raw.descricao.trim(),
      comprovantes: this.uploads()
        .filter((upload) => upload.status === 'uploaded' && upload.serverId)
        .map((upload) => upload.serverId as string),
    };

    this.submitting.set(true);
    this.activitiesApi.createActivity(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open('Atividade registrada com sucesso.', 'Fechar', { duration: 3000 });
        void this.router.navigate(['/atividades']);
      },
      error: (error: unknown) => {
        this.submitting.set(false);
        const message = this.resolveHttpError(error, 'Não foi possível confirmar o registro da atividade.');
        this.snackBar.open(message, 'Fechar', { duration: 4500 });
      },
    });
  }

  protected uploadStatusClass(status: UploadItem['status']): string {
    const base = 'text-[0.8125rem] leading-[1.125rem]';
    switch (status) {
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
      this.snackBar.open('Selecione arquivos PDF, PNG ou JPG com até 10MB.', 'Fechar', { duration: 4000 });
      return;
    }

    for (const file of acceptedFiles) {
      const localId = crypto.randomUUID();
      const pending: UploadItem = {
        localId,
        fileName: file.name,
        sizeBytes: file.size,
        status: 'uploading',
      };

      this.uploads.update((uploads) => [...uploads, pending]);

      this.activitiesApi.uploadEvidence(file).subscribe({
        next: (response) => {
          this.uploads.update((uploads) =>
            uploads.map((upload) =>
              upload.localId === localId
                ? {
                    ...upload,
                    status: 'uploaded',
                    serverId: response.id,
                    fileName: response.originalName || response.filename,
                    sizeBytes: response.size || upload.sizeBytes,
                  }
                : upload,
            ),
          );
        },
        error: () => {
          this.uploads.update((uploads) =>
            uploads.map((upload) =>
              upload.localId === localId
                ? {
                    ...upload,
                    status: 'error',
                  }
                : upload,
            ),
          );
          this.snackBar.open(`Falha ao enviar "${file.name}".`, 'Fechar', { duration: 4000 });
        },
      });
    }
  }

  private recomputeEstimate(): void {
    const categoria = this.form.controls.categoria.value;
    const cargaHoraria = Number(this.form.controls.cargaHoraria.value || 0);

    if (!categoria || cargaHoraria <= 0) {
      this.scoreEstimate.set({
        baseCategoria: this.baseScoreForCategory(categoria as ActivityCategoryCode | ''),
        fatorCargaHoraria: 0,
        impactoTotal: this.baseScoreForCategory(categoria as ActivityCategoryCode | ''),
        percentualMeta: 0,
      });
      return;
    }

    this.activitiesApi
      .estimateScore({ categoria, cargaHoraria })
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
    const baseCategoria = this.baseScoreForCategory(categoria);
    const fatorCargaHoraria = Math.max(0, Number((cargaHoraria * 0.0625).toFixed(1)));
    const impactoTotal = Number((baseCategoria + fatorCargaHoraria).toFixed(1));
    const percentualMeta = Math.min(100, Math.round((impactoTotal / 150) * 100));

    return {
      baseCategoria,
      fatorCargaHoraria,
      impactoTotal,
      percentualMeta,
    };
  }

  private baseScoreForCategory(categoria: ActivityCategoryCode | ''): number {
    switch (categoria) {
      case 'ENSINO':
        return 10;
      case 'PESQUISA':
        return 15;
      case 'EXTENSAO':
        return 12;
      case 'GESTAO':
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

