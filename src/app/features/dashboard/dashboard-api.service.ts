import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../core/http/api-envelope.types';
import { DashboardHomeData } from './models/dashboard-home.models';
import { getApiUrl } from '../../core/config/runtime-config';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;

  getHome(): Observable<DashboardHomeData> {
    return this.http
      .get<ApiSuccessResponse<DashboardHomeData>>(`${this.apiBaseUrl}/dashboard/home`)
      .pipe(map((response) => response.data));
  }
}
