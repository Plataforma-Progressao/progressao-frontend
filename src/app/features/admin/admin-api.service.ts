import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../core/http/api-envelope.types';
import { getApiUrl } from '../../core/config/runtime-config';
import { AuthResponseUser } from '../../core/auth/auth.models';
import {
  AdminDashboardHomeData,
  AdminUserListItem,
  AdminUsersQuery,
  AssignEvaluatorPayload,
  CreateAdminUserPayload,
  EvaluatorAssignmentListItem,
  EvaluatorAssignmentsQuery,
  PaginatedAdminUsersResponse,
  PaginatedEvaluatorAssignmentsResponse,
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

  getDashboardHome(): Observable<AdminDashboardHomeData> {
    return this.http
      .get<ApiSuccessResponse<AdminDashboardHomeData> | AdminDashboardHomeData>(
        `${this.apiBaseUrl}/admin/dashboard/home`,
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  listAssignments(
    query: EvaluatorAssignmentsQuery,
  ): Observable<PaginatedEvaluatorAssignmentsResponse> {
    let params = new HttpParams()
      .set('page', String(query.page))
      .set('pageSize', String(query.pageSize));

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    if (query.unassignedOnly) {
      params = params.set('unassignedOnly', 'true');
    }

    if (query.evaluatorId) {
      params = params.set('evaluatorId', query.evaluatorId);
    }

    return this.http
      .get<
        ApiSuccessResponse<PaginatedEvaluatorAssignmentsResponse> | PaginatedEvaluatorAssignmentsResponse
      >(`${this.apiBaseUrl}/admin/evaluator-assignments`, { params })
      .pipe(map((response) => this.unwrapData(response)));
  }

  assignEvaluator(
    teacherId: string,
    payload: AssignEvaluatorPayload,
  ): Observable<EvaluatorAssignmentListItem> {
    return this.http
      .put<ApiSuccessResponse<EvaluatorAssignmentListItem> | EvaluatorAssignmentListItem>(
        `${this.apiBaseUrl}/admin/evaluator-assignments/${teacherId}`,
        payload,
      )
      .pipe(map((response) => this.unwrapData(response)));
  }

  unassignEvaluator(teacherId: string): Observable<EvaluatorAssignmentListItem> {
    return this.http
      .delete<ApiSuccessResponse<EvaluatorAssignmentListItem> | EvaluatorAssignmentListItem>(
        `${this.apiBaseUrl}/admin/evaluator-assignments/${teacherId}`,
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
