import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../core/http/api-envelope.types';
import { getApiUrl } from '../../core/config/runtime-config';
import { AuthResponseUser } from '../../core/auth/auth.models';
import {
  AdminUserListItem,
  AdminUsersQuery,
  CreateAdminUserPayload,
  PaginatedAdminUsersResponse,
  UpdateAdminUserRolesPayload,
} from './models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;

  listUsers(query: AdminUsersQuery): Observable<PaginatedAdminUsersResponse> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('pageSize', String(query.pageSize));

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    if (query.role) {
      params = params.set('role', query.role);
    }

    return this.http
      .get<ApiSuccessResponse<PaginatedAdminUsersResponse> | PaginatedAdminUsersResponse>(
        `${this.apiBaseUrl}/admin/users`,
        { params },
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  createUser(payload: CreateAdminUserPayload): Observable<AuthResponseUser> {
    return this.http
      .post<ApiSuccessResponse<AuthResponseUser> | AuthResponseUser>(
        `${this.apiBaseUrl}/admin/users`,
        payload,
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  updateRoles(
    userId: string,
    payload: UpdateAdminUserRolesPayload,
  ): Observable<AdminUserListItem> {
    return this.http
      .patch<ApiSuccessResponse<AdminUserListItem> | AdminUserListItem>(
        `${this.apiBaseUrl}/admin/users/${userId}/roles`,
        payload,
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
