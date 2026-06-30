import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../core/http/api-envelope.types';
import { getApiUrl } from '../../core/config/runtime-config';
import {
  EvaluatorActivitiesQuery,
  EvaluatorActivityDetail,
  PaginatedEvaluatorActivitiesResponse,
  RejectActivityPayload,
  EvaluatorDashboardHomeData,
} from './models/evaluator.models';
import { ActivityDetailDto } from '../atividades/models/activity-create.models';

@Injectable({ providedIn: 'root' })
export class EvaluatorApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;

  listActivities(
    query: EvaluatorActivitiesQuery,
  ): Observable<PaginatedEvaluatorActivitiesResponse> {
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
    } else {
      params = params.set('status', 'PENDING');
    }

    return this.http
      .get<
        | ApiSuccessResponse<PaginatedEvaluatorActivitiesResponse>
        | PaginatedEvaluatorActivitiesResponse
      >(`${this.apiBaseUrl}/evaluator/activities`, { params })
      .pipe(map((response) => this.unwrapData(response)));
  }

  getActivity(id: string): Observable<EvaluatorActivityDetail> {
    return this.http
      .get<ApiSuccessResponse<EvaluatorActivityDetail> | EvaluatorActivityDetail>(
        `${this.apiBaseUrl}/evaluator/activities/${id}`,
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  approve(id: string): Observable<ActivityDetailDto> {
    return this.http
      .post<ApiSuccessResponse<ActivityDetailDto> | ActivityDetailDto>(
        `${this.apiBaseUrl}/evaluator/activities/${id}/approve`,
        {},
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  reject(id: string, payload: RejectActivityPayload): Observable<ActivityDetailDto> {
    return this.http
      .post<ApiSuccessResponse<ActivityDetailDto> | ActivityDetailDto>(
        `${this.apiBaseUrl}/evaluator/activities/${id}/reject`,
        payload,
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  getEvidenceFileUrl(evidenceId: string): string {
    return `${this.apiBaseUrl}/evaluator/activities/evidences/${evidenceId}/file`;
  }

  getDashboardHome(): Observable<EvaluatorDashboardHomeData> {
    return this.http
      .get<ApiSuccessResponse<EvaluatorDashboardHomeData> | EvaluatorDashboardHomeData>(
        `${this.apiBaseUrl}/evaluator/dashboard/home`,
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  private unwrapData<T>(response: ApiSuccessResponse<T> | T): T {
    if (response && typeof response === 'object' && 'data' in response) {
      return (response as ApiSuccessResponse<T>).data;
    }

    return response as T;
  }
}
