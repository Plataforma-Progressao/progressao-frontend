import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../core/http/api-envelope.types';
import { getApiUrl } from '../../core/config/runtime-config';
import {
  ActivityChangeLogList,
  ActivityClassificationResult,
  ActivityCreatePayload,
  ActivityCreateResponse,
  ActivityDetailDto,
  ActivityEvidenceUploadResponse,
  ActivitiesListQuery,
  ActivityListItemDto,
  ActivityScoreEstimate,
  ActivityScoreEstimateRequest,
  ClassifyActivityRequest,
  OptimizeClassificationResult,
  PaginatedActivitiesResponse,
} from './models/activity-create.models';

@Injectable({ providedIn: 'root' })
export class ActivitiesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;

  listActivities(query: ActivitiesListQuery): Observable<PaginatedActivitiesResponse> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('pageSize', String(query.pageSize));

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    if (query.category) {
      params = params.set('category', query.category);
    }

    if (query.status) {
      params = params.set('status', query.status);
    }

    if (query.term?.trim()) {
      params = params.set('term', query.term.trim());
    }

    return this.http
      .get<
        ApiSuccessResponse<PaginatedActivitiesResponse> | PaginatedActivitiesResponse
      >(`${this.apiBaseUrl}/activities`, { params })
      .pipe(map((response) => this.unwrapData(response)));
  }

  findActivityById(activityId: string): Observable<ActivityDetailDto> {
    return this.http
      .get<ApiSuccessResponse<ActivityDetailDto> | ActivityDetailDto>(
        `${this.apiBaseUrl}/activities/${activityId}`,
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  getActivityChanges(activityId: string): Observable<ActivityChangeLogList> {
    return this.http
      .get<ApiSuccessResponse<ActivityChangeLogList> | ActivityChangeLogList>(
        `${this.apiBaseUrl}/activities/${activityId}/changes`,
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  downloadEvidenceFile(evidenceId: string): Observable<Blob> {
    return this.http.get(`${this.apiBaseUrl}/activities/evidences/${evidenceId}/file`, {
      responseType: 'blob',
    });
  }

  createActivity(payload: ActivityCreatePayload): Observable<ActivityCreateResponse> {
    return this.http
      .post<ApiSuccessResponse<ActivityCreateResponse>>(`${this.apiBaseUrl}/activities`, payload)
      .pipe(map((response) => response.data));
  }

  updateActivity(
    activityId: string,
    payload: ActivityCreatePayload,
  ): Observable<ActivityCreateResponse> {
    return this.http
      .patch<
        ApiSuccessResponse<ActivityCreateResponse>
      >(`${this.apiBaseUrl}/activities/${activityId}`, payload)
      .pipe(map((response) => response.data));
  }

  removeActivity(activityId: string): Observable<{ id: string }> {
    return this.http.delete<{ id: string }>(`${this.apiBaseUrl}/activities/${activityId}`);
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
    return this.http.delete<void>(`${this.apiBaseUrl}/activities/evidences/${evidenceId}`);
  }

  estimateScore(payload: ActivityScoreEstimateRequest): Observable<ActivityScoreEstimate> {
    return this.http
      .post<
        ApiSuccessResponse<ActivityScoreEstimate> | ActivityScoreEstimate
      >(`${this.apiBaseUrl}/activities/estimate`, payload)
      .pipe(map((response) => this.unwrapData(response)));
  }

  classify(payload: ClassifyActivityRequest): Observable<ActivityClassificationResult> {
    return this.http
      .post<
        ApiSuccessResponse<ActivityClassificationResult> | ActivityClassificationResult
      >(`${this.apiBaseUrl}/activities/classify`, payload)
      .pipe(map((response) => this.unwrapData(response)));
  }

  optimizeClassification(
    payload: ClassifyActivityRequest,
  ): Observable<OptimizeClassificationResult> {
    return this.http
      .post<
        ApiSuccessResponse<OptimizeClassificationResult> | OptimizeClassificationResult
      >(`${this.apiBaseUrl}/activities/optimize-classification`, payload)
      .pipe(map((response) => this.unwrapData(response)));
  }

  private unwrapData<T>(response: ApiSuccessResponse<T> | T): T {
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
      return (response as ApiSuccessResponse<T>).data;
    }

    return response as T;
  }
}
