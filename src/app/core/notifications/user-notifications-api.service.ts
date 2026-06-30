import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../http/api-envelope.types';
import { getApiUrl } from '../config/runtime-config';
import {
  ListUserNotificationsQuery,
  PaginatedUserNotificationsResponse,
  UserNotification,
} from './user-notifications.models';

@Injectable({ providedIn: 'root' })
export class UserNotificationsApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;

  list(query: ListUserNotificationsQuery = {}): Observable<PaginatedUserNotificationsResponse> {
    let params = new HttpParams();

    if (query.page !== undefined) {
      params = params.set('page', String(query.page));
    }

    if (query.pageSize !== undefined) {
      params = params.set('pageSize', String(query.pageSize));
    }

    if (query.unreadOnly) {
      params = params.set('unreadOnly', 'true');
    }

    return this.http
      .get<
        ApiSuccessResponse<PaginatedUserNotificationsResponse> | PaginatedUserNotificationsResponse
      >(`${this.apiBaseUrl}/notifications`, { params })
      .pipe(map((response) => this.unwrapData(response)));
  }

  unreadCount(): Observable<{ count: number }> {
    return this.http
      .get<ApiSuccessResponse<{ count: number }> | { count: number }>(
        `${this.apiBaseUrl}/notifications/unread-count`,
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  markRead(id: string): Observable<UserNotification> {
    return this.http
      .patch<ApiSuccessResponse<UserNotification> | UserNotification>(
        `${this.apiBaseUrl}/notifications/${id}/read`,
        {},
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  markAllRead(): Observable<{ updated: number }> {
    return this.http
      .patch<ApiSuccessResponse<{ updated: number }> | { updated: number }>(
        `${this.apiBaseUrl}/notifications/read-all`,
        {},
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
