import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../../core/http/api-envelope.types';
import { getApiUrl } from '../../../core/config/runtime-config';
import { normalizeReportPayload, type RadReportPayload } from '../../../report-layout';

@Injectable({ providedIn: 'root' })
export class ReportApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;

  getRadReport(): Observable<RadReportPayload> {
    return this.http
      .get<ApiSuccessResponse<unknown>>(`${this.apiBaseUrl}/atividades`)
      .pipe(map((response) => normalizeReportPayload(response.data)));
  }
}
