export type AtividadeCategoria = 'ENSINO' | 'PESQUISA' | 'EXTENSAO' | 'GESTAO';

export interface AtividadeCreatePayload {
  readonly titulo: string;
  readonly categoria: AtividadeCategoria;
  readonly cargaHoraria: number;
  readonly descricao: string;
  readonly comprovantes: readonly string[];
}

export interface AtividadeCreateResponse {
  readonly id: string;
  readonly titulo: string;
}

export interface AtividadeComprovanteUploadResponse {
  readonly id: string;
  readonly filename: string;
  readonly originalName: string;
  readonly size: number;
  readonly url?: string;
}

export interface AtividadeScoreEstimate {
  readonly baseCategoria: number;
  readonly fatorCargaHoraria: number;
  readonly impactoTotal: number;
  readonly percentualMeta: number;
}

export interface AtividadeScoreEstimateRequest {
  readonly categoria: AtividadeCategoria;
  readonly cargaHoraria: number;
}

