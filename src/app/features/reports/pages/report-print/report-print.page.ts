import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { resource } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { RadDocumentComponent } from '../../../../report-layout';
import { RELATORIOS_BASE_PATH } from '../../report-app-urls';
import { ReportApiService } from '../../services/report-api.service';
import { consumeReportPrintSnapshot } from '../../utils/report-print-snapshot';
import { buildRadPdfSuggestedTitle } from '../../utils/report-pdf-default-title';

const DEFAULT_BROWSER_TAB_TITLE = 'Plataforma Progressão Docente';

@Component({
  selector: 'app-report-print-page',
  imports: [RadDocumentComponent],
  template: `
    <section class="report-print" [attr.aria-busy]="isLoading() ? 'true' : 'false'">
      @if (isLoading()) {
        <p class="report-print__status" role="status">Preparando relatorio para impressao...</p>
      } @else if (hasError()) {
        <div class="report-print__error" role="alert">
          Nao foi possivel preparar o relatorio para impressao.
          <button type="button" (click)="reportResource.reload()">Tentar novamente</button>
          <button type="button" (click)="leavePrintView()">Voltar aos relatorios</button>
        </div>
      } @else {
        <app-rad-document
          [userData]="data().userData"
          [metadata]="data().metadata"
          [activities]="data().activities"
        />
      }
    </section>
  `,
  styleUrl: './report-print.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportPrintPage {
  private readonly reportApi = inject(ReportApiService);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly printFlowStarted = signal(false);
  private isNavigatingAway = false;
  private titleBeforePrint = DEFAULT_BROWSER_TAB_TITLE;

  protected readonly reportResource = resource({
    loader: () => {
      const snapshot = consumeReportPrintSnapshot();
      if (snapshot) {
        return Promise.resolve(snapshot);
      }
      return firstValueFrom(this.reportApi.getRadReport());
    },
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

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) {
        return;
      }
      if (this.reportResource.status() === 'loading') {
        return;
      }
      if (this.reportResource.status() === 'error') {
        return;
      }
      if (this.reportResource.value() === undefined) {
        return;
      }
      if (this.printFlowStarted()) {
        return;
      }
      this.printFlowStarted.set(true);
      this.queuePrintAndReturn();
    });
  }

  protected leavePrintView(): void {
    if (this.isNavigatingAway) {
      return;
    }
    this.isNavigatingAway = true;
    this.title.setTitle(this.titleBeforePrint);
    void this.router.navigateByUrl(RELATORIOS_BASE_PATH);
  }

  private queuePrintAndReturn(): void {
    this.setupReturnAfterPrintListeners();

    const runPrint = () => {
      const payload = this.reportResource.value();
      if (payload) {
        this.titleBeforePrint = this.title.getTitle();
        this.title.setTitle(buildRadPdfSuggestedTitle(payload));
      }
      window.print();
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(runPrint, 0);
      });
    });
  }

  private setupReturnAfterPrintListeners(): void {
    const scheduleReturn = () => {
      setTimeout(() => this.leavePrintView(), 120);
    };

    window.addEventListener('afterprint', scheduleReturn, { once: true });

    const mediaQuery = window.matchMedia('print');
    const printChangeListener = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        scheduleReturn();
        mediaQuery.removeEventListener('change', printChangeListener);
      }
    };

    mediaQuery.addEventListener('change', printChangeListener);

    setTimeout(() => {
      mediaQuery.removeEventListener('change', printChangeListener);
      scheduleReturn();
    }, 12000);
  }
}
