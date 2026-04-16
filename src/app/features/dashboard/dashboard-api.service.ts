import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiSuccessResponse } from '../../core/http/api-envelope.types';
import { DashboardHomeData } from './models/dashboard-home.models';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${environment.apiUrl.replace(/\/+$/, '')}/api`;

  getHome(): Observable<DashboardHomeData> {
    return this.http
      .get<ApiSuccessResponse<DashboardHomeData>>(`${this.apiBaseUrl}/dashboard/home`)
      .pipe(map((response) => response.data));
  }
}
