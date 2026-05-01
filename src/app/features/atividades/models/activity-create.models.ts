/** Category codes as sent to / accepted from the API (legacy Portuguese enum values). */
export type ActivityCategoryCode = 'ENSINO' | 'PESQUISA' | 'EXTENSAO' | 'GESTAO';

export interface ActivityCreatePayload {
  readonly titulo: string;
  readonly categoria: ActivityCategoryCode;
  readonly cargaHoraria: number;
  readonly descricao: string;
  readonly comprovantes: readonly string[];
}

export interface ActivityCreateResponse {
  readonly id: string;
  readonly titulo: string;
}

export interface ActivityEvidenceUploadResponse {
  readonly id: string;
  readonly filename: string;
  readonly originalName: string;
  readonly size: number;
  readonly url?: string;
}

export interface ActivityScoreEstimate {
  readonly baseCategoria: number;
  readonly fatorCargaHoraria: number;
  readonly impactoTotal: number;
  readonly percentualMeta: number;
}

export interface ActivityScoreEstimateRequest {
  readonly categoria: ActivityCategoryCode;
  readonly cargaHoraria: number;
}
