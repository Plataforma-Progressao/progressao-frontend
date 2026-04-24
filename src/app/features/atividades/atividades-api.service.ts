import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiSuccessResponse } from '../../core/http/api-envelope.types';
import { getApiUrl } from '../../core/config/runtime-config';
import {
  AtividadeComprovanteUploadResponse,
  AtividadeCreatePayload,
  AtividadeCreateResponse,
  AtividadeScoreEstimate,
  AtividadeScoreEstimateRequest,
} from './models/atividade-create.models';

@Injectable({ providedIn: 'root' })
export class AtividadesApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = `${getApiUrl().replace(/\/+$/, '')}/api`;

  createAtividade(payload: AtividadeCreatePayload): Observable<AtividadeCreateResponse> {
    return this.http
      .post<ApiSuccessResponse<AtividadeCreateResponse>>(`${this.apiBaseUrl}/atividades`, payload)
      .pipe(map((response) => response.data));
  }

  uploadComprovante(file: File): Observable<AtividadeComprovanteUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ApiSuccessResponse<AtividadeComprovanteUploadResponse>>(
        `${this.apiBaseUrl}/atividades/comprovantes`,
        formData,
      )
      .pipe(map((response) => response.data));
  }

  deleteComprovante(comprovanteId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/atividades/comprovantes/${comprovanteId}`);
  }

  estimatePontuacao(payload: AtividadeScoreEstimateRequest): Observable<AtividadeScoreEstimate> {
    return this.http
      .post<ApiSuccessResponse<AtividadeScoreEstimate>>(
        `${this.apiBaseUrl}/atividades/pontuacao/estimativa`,
        payload,
      )
      .pipe(map((response) => response.data));
  }
}

