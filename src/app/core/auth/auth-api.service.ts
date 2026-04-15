import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiSuccessResponse } from '../http/api-envelope.types';
import {
  AuthCredentials,
  AuthResponse,
  AuthResponseUser,
  LogoutResponse,
  RegisterPayload,
  TokenPair,
} from './auth.models';
import { SKIP_AUTH } from './interceptors/auth-context.tokens';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${environment.apiUrl.replace(/\/+$/, '')}/api`;
  private readonly authlessContext = new HttpContext().set(SKIP_AUTH, true);

  login(credentials: AuthCredentials): Observable<AuthResponse> {
    return this.http
      .post<
        ApiSuccessResponse<AuthResponse>
      >(`${this.apiBaseUrl}/auth/login`, credentials, { context: this.authlessContext })
      .pipe(map((response) => response.data));
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http
      .post<
        ApiSuccessResponse<AuthResponse>
      >(`${this.apiBaseUrl}/auth/register`, payload, { context: this.authlessContext })
      .pipe(map((response) => response.data));
  }

  refresh(refreshToken: string): Observable<TokenPair> {
    return this.http
      .post<
        ApiSuccessResponse<TokenPair>
      >(`${this.apiBaseUrl}/auth/refresh`, { refreshToken }, { context: this.authlessContext })
      .pipe(map((response) => response.data));
  }

  logout(refreshToken: string): Observable<LogoutResponse> {
    return this.http
      .post<
        ApiSuccessResponse<LogoutResponse>
      >(`${this.apiBaseUrl}/auth/logout`, { refreshToken }, { context: this.authlessContext })
      .pipe(map((response) => response.data));
  }

  me(): Observable<AuthResponseUser> {
    return this.http
      .get<ApiSuccessResponse<AuthResponseUser>>(`${this.apiBaseUrl}/users/me`)
      .pipe(map((response) => response.data));
  }
}
