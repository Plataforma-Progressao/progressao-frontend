import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, finalize, forkJoin, tap } from 'rxjs';
import { AdminApiService } from '../../admin-api.service';
import {
  BAREMA_CATEGORY_LABELS,
  BaremaActivityRule,
  BaremaCategoryRule,
} from '../../models/barema.models';
import { ActivityCategoryCode } from '../../../atividades/models/activity-create.models';
import { BadgeComponent } from '../../../../shared/components/base/badge/badge.component';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { NotificationService } from '../../../../core/notifications/notification.service';

@Component({
  selector: 'app-admin-barema-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    BadgeComponent,
    ButtonComponent,
  ],
  templateUrl: './barema.page.html',
  styleUrl: './barema.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBaremaPage {
  private readonly adminApi = inject(AdminApiService);
  private readonly notificationService = inject(NotificationService);

  protected readonly categoryLabels = BAREMA_CATEGORY_LABELS;
  protected readonly loading = signal(false);
  protected readonly savingCategory = signal(false);
  protected readonly loadError = signal<string | null>(null);
  protected readonly categoryRules = signal<readonly BaremaCategoryRule[]>([]);
  protected readonly activityRules = signal<readonly BaremaActivityRule[]>([]);
  protected readonly scoreTarget = signal(0);

  protected readonly displayedColumns = [
    'category',
    'kind',
    'keywords',
    'fixedScore',
    'priority',
    'isActive',
  ] as const;

  protected readonly categoryOptions: readonly ActivityCategoryCode[] = [
    'TEACHING',
    'RESEARCH',
    'OUTREACH',
    'MANAGEMENT',
  ];

  protected readonly ceilingForm = new FormGroup({
    category: new FormControl<ActivityCategoryCode>('TEACHING', { nonNullable: true }),
    ceilingScore: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    minimumTarget: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  protected readonly selectedCategoryRule = computed(() => {
    const category = this.ceilingForm.controls.category.value;
    return this.categoryRules().find((rule) => rule.category === category) ?? null;
  });

  constructor() {
    this.ceilingForm.controls.category.valueChanges.subscribe((category) => {
      const rule = this.categoryRules().find((item) => item.category === category);
      if (rule) {
        this.ceilingForm.patchValue(
          {
            ceilingScore: Number(rule.ceilingScore),
            minimumTarget: Number(rule.minimumTarget),
          },
          { emitEvent: false },
        );
      }
    });

    this.loadData();
  }

  protected retry(): void {
    this.loadData();
  }

  protected categoryLabel(category: ActivityCategoryCode): string {
    return this.categoryLabels[category];
  }

  protected saveCategoryCeiling(): void {
    if (this.ceilingForm.invalid) {
      this.ceilingForm.markAllAsTouched();
      return;
    }

    const { category, ceilingScore, minimumTarget } = this.ceilingForm.getRawValue();
    this.savingCategory.set(true);

    this.adminApi
      .updateBaremaCategoryRule(category, { ceilingScore, minimumTarget })
      .pipe(
        tap((updated) => {
          this.categoryRules.update((rules) =>
            rules.map((rule) => (rule.id === updated.id ? updated : rule)),
          );
          this.notificationService.success('Tetos do pilar atualizados.');
        }),
        catchError((error: unknown) => {
          this.notificationService.error(this.resolveError(error));
          return EMPTY;
        }),
        finalize(() => this.savingCategory.set(false)),
      )
      .subscribe();
  }

  protected keywordsLabel(rule: BaremaActivityRule): string {
    return rule.keywords.length > 0 ? rule.keywords.join(', ') : '—';
  }

  private loadData(): void {
    this.loading.set(true);
    this.loadError.set(null);

    forkJoin({
      config: this.adminApi.getBaremaConfig(),
      rules: this.adminApi.listBaremaActivityRules(),
    })
      .pipe(
        tap(({ config, rules }) => {
          this.categoryRules.set(config.categoryRules);
          this.activityRules.set(rules);
          this.scoreTarget.set(Number(config.scoreTarget));

          const firstCategory = config.categoryRules[0]?.category ?? 'TEACHING';
          const firstRule = config.categoryRules[0];
          this.ceilingForm.patchValue(
            {
              category: firstCategory,
              ceilingScore: Number(firstRule?.ceilingScore ?? 0),
              minimumTarget: Number(firstRule?.minimumTarget ?? 0),
            },
            { emitEvent: false },
          );
        }),
        catchError((error: unknown) => {
          this.loadError.set(this.resolveError(error));
          this.categoryRules.set([]);
          this.activityRules.set([]);
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

    return 'Não foi possível carregar a configuração do barema.';
  }
}
