import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../core/http/api-envelope.types';
import { getApiUrl } from '../../core/config/runtime-config';
import {
  ChecklistHomeData,
  ChecklistHomeItem,
  UpdateChecklistItemPayload,
} from './models/checklist.models';

@Injectable({ providedIn: 'root' })
export class ChecklistApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;

  getHome(): Observable<ChecklistHomeData> {
    return this.http
      .get<ApiSuccessResponse<ChecklistHomeData> | ChecklistHomeData>(
        `${this.apiBaseUrl}/checklist/home`,
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  updateItem(
    itemId: string,
    payload: UpdateChecklistItemPayload,
  ): Observable<ChecklistHomeItem> {
    return this.http
      .patch<ApiSuccessResponse<ChecklistHomeItem> | ChecklistHomeItem>(
        `${this.apiBaseUrl}/checklist/items/${itemId}`,
        payload,
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  private unwrapData<T>(response: ApiSuccessResponse<T> | T): T {
    if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
      return (response as ApiSuccessResponse<T>).data;
    }

    return response as T;
  }
}
