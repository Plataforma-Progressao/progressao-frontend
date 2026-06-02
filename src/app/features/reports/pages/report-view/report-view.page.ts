import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { resource } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RadDocumentComponent } from '../../../../report-layout';
import { ButtonComponent } from '../../../../shared/components/base/button/button.component';
import { RELATORIOS_PRINT_PATH } from '../../report-app-urls';
import { ReportApiService } from '../../services/report-api.service';
import { saveReportPrintSnapshot } from '../../utils/report-print-snapshot';

@Component({
  selector: 'app-report-view-page',
  imports: [RadDocumentComponent, ButtonComponent, MatIconModule],
  template: `
    <section class="report-view" aria-labelledby="report-view-heading">
      <header class="report-view__header">
        <div class="report-view__title-wrap">
          <span class="report-view__title-icon" aria-hidden="true">
            <mat-icon>description</mat-icon>
          </span>
          <h1 id="report-view-heading">Visualizacao do RAD</h1>
        </div>
        <app-button
          variant="primary"
          label="Exportar PDF"
          prefixIcon="picture_as_pdf"
          [loading]="isOpeningPrint()"
          [disabled]="exportDisabled()"
          (clicked)="openPrintRoute()"
        />
      </header>

      @if (isLoading()) {
        <p class="report-view__status" role="status">Carregando relatorio...</p>
      } @else if (hasError()) {
        <div class="report-view__error" role="alert">
          Nao foi possivel carregar o relatorio no momento.
          <button type="button" (click)="reportResource.reload()">Tentar novamente</button>
        </div>
      } @else {
        @if (validationMessage()) {
          <div class="report-view__notice" role="status">
            {{ validationMessage() }}
          </div>
        }

        <div class="report-view__document-wrap">
          <app-rad-document
            [userData]="data().userData"
            [metadata]="data().metadata"
            [activities]="data().activities"
          />
        </div>

        <div class="report-view__cards" aria-label="Informacoes complementares">
          <section class="report-info-card report-info-card--primary" aria-labelledby="next-steps-title">
            <h2 id="next-steps-title">Proximos passos</h2>
            <p>
              Apos conferir o RAD, utilize a exportacao em PDF para arquivar ou compartilhar o documento conforme as
              normas da sua instituicao.
            </p>
            <p class="report-info-card__meta">
              <mat-icon aria-hidden="true">schedule</mat-icon>
              <span><strong>Prazo final:</strong> consulte o calendario do ciclo na Pro-Reitoria.</span>
            </p>
          </section>
          <section class="report-info-card report-info-card--outline" aria-labelledby="attachments-title">
            <h2 id="attachments-title">Atencao aos anexos</h2>
            <p>
              Certifique-se de que todos os comprovantes necessarios estao disponiveis no modulo de Documentacao antes
              de submeter o pacote oficial, quando aplicavel.
            </p>
          </section>
        </div>
      }
    </section>
  `,
  styleUrl: './report-view.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportViewPage {
  private readonly reportApi = inject(ReportApiService);
  private readonly router = inject(Router);

  protected readonly isOpeningPrint = signal(false);

  protected readonly reportResource = resource({
    loader: () => firstValueFrom(this.reportApi.getRadReport()),
  });

  protected readonly isLoading = computed(() => this.reportResource.status() === 'loading');
  protected readonly hasError = computed(() => this.reportResource.status() === 'error');
  protected readonly data = computed(
    () =>
      this.reportResource.value() ?? {
        userData: {
          id: 'fallback',
          name: 'Docente nao identificado',
          siapeId: 'N/A',
          department: 'Departamento nao informado',
          workRegime: 'Regime nao informado',
        },
        metadata: {
          institution: 'Universidade Federal do Conhecimento',
          graduateOfficeTitle: 'Pro-Reitoria de Graduacao e Pesquisa',
          documentLabel: 'Documento preliminar',
          cycleLabel: 'Ciclo nao informado',
          issuedAtLabel: 'Data nao informada',
          cycleStatus: 'Sem status',
        },
        activities: [],
      },
  );

  protected readonly approvedCount = computed(
    () => this.data().activities.filter((item) => item.status === 'APPROVED').length,
  );

  protected readonly validationMessage = computed(() => {
    if (this.isLoading() || this.hasError()) {
      return null;
    }
    if (this.data().activities.length === 0) {
      return 'Nenhuma atividade foi retornada. O quadro e o detalhamento podem ficar vazios ate que existam registos.';
    }
    if (this.approvedCount() === 0) {
      return 'Nao ha atividades com status aprovado no momento. O RAD exibira apenas cabecalhos e totais em zero.';
    }
    return null;
  });

  protected readonly exportDisabled = computed(
    () => this.isLoading() || this.hasError() || this.isOpeningPrint(),
  );

  protected openPrintRoute(): void {
    if (this.exportDisabled()) {
      return;
    }

    this.isOpeningPrint.set(true);
    saveReportPrintSnapshot(this.data());

    void this.router.navigateByUrl(RELATORIOS_PRINT_PATH).finally(() => this.isOpeningPrint.set(false));
  }
}
