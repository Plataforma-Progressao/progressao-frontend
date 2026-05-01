import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../core/http/api-envelope.types';
import { getApiUrl } from '../../core/config/runtime-config';
import {
  ActivityCreatePayload,
  ActivityCreateResponse,
  ActivityEvidenceUploadResponse,
  ActivityScoreEstimate,
  ActivityScoreEstimateRequest,
} from './models/activity-create.models';

@Injectable({ providedIn: 'root' })
export class ActivitiesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;

  createActivity(payload: ActivityCreatePayload): Observable<ActivityCreateResponse> {
    return this.http
      .post<ApiSuccessResponse<ActivityCreateResponse>>(`${this.apiBaseUrl}/atividades`, payload)
      .pipe(map((response) => response.data));
  }

  uploadEvidence(file: File): Observable<ActivityEvidenceUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ApiSuccessResponse<ActivityEvidenceUploadResponse>>(
        `${this.apiBaseUrl}/atividades/comprovantes`,
        formData,
      )
      .pipe(map((response) => response.data));
  }

  deleteEvidence(evidenceId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/atividades/comprovantes/${evidenceId}`);
  }

  estimateScore(payload: ActivityScoreEstimateRequest): Observable<ActivityScoreEstimate> {
    return this.http
      .post<ApiSuccessResponse<ActivityScoreEstimate>>(
        `${this.apiBaseUrl}/atividades/pontuacao/estimativa`,
        payload,
      )
      .pipe(map((response) => response.data));
  }
}
