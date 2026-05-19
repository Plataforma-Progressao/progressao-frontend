import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../core/http/api-envelope.types';
import { getApiUrl } from '../../core/config/runtime-config';
import {
  ActivityCreatePayload,
  ActivityCreateResponse,
  ActivityEvidenceUploadResponse,
  ActivityListItem,
  ActivityScoreEstimate,
  ActivityScoreEstimateRequest,
  ActivityUpdatePayload,
} from './models/activity-create.models';

@Injectable({ providedIn: 'root' })
export class ActivitiesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;

  getActivities(): Observable<readonly ActivityListItem[]> {
    return this.http
      .get<ApiSuccessResponse<readonly ActivityListItem[]>>(`${this.apiBaseUrl}/activities`)
      .pipe(map((response) => response.data));
  }

  getActivity(id: string): Observable<ActivityCreateResponse> {
    return this.http
      .get<ApiSuccessResponse<ActivityCreateResponse>>(`${this.apiBaseUrl}/activities/${id}`)
      .pipe(map((response) => response.data));
  }

  createActivity(payload: ActivityCreatePayload): Observable<ActivityCreateResponse> {
    return this.http
      .post<ApiSuccessResponse<ActivityCreateResponse>>(`${this.apiBaseUrl}/activities`, payload)
      .pipe(map((response) => response.data));
  }

  updateActivity(id: string, payload: ActivityUpdatePayload): Observable<ActivityCreateResponse> {
    return this.http
      .patch<
        ApiSuccessResponse<ActivityCreateResponse>
      >(`${this.apiBaseUrl}/activities/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  deleteActivity(id: string): Observable<{ id: string }> {
    return this.http
      .delete<ApiSuccessResponse<{ id: string }>>(`${this.apiBaseUrl}/activities/${id}`)
      .pipe(map((response) => response.data));
  }

  uploadEvidence(activityId: string, file: File): Observable<ActivityEvidenceUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<
        ApiSuccessResponse<ActivityEvidenceUploadResponse>
      >(`${this.apiBaseUrl}/activities/${activityId}/evidences`, formData)
      .pipe(map((response) => response.data));
  }

  deleteEvidence(evidenceId: string): Observable<void> {
    return this.http
      .delete<
        ApiSuccessResponse<{ id: string }>
      >(`${this.apiBaseUrl}/activities/evidences/${evidenceId}`)
      .pipe(map(() => void 0));
  }

  estimateScore(payload: ActivityScoreEstimateRequest): Observable<ActivityScoreEstimate> {
    return this.http
      .post<
        ApiSuccessResponse<ActivityScoreEstimate>
      >(`${this.apiBaseUrl}/activities/estimate`, payload)
      .pipe(map((response) => response.data));
  }
}
