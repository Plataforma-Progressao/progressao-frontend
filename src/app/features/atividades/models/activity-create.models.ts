export type ActivityCategoryCode = 'TEACHING' | 'RESEARCH' | 'OUTREACH' | 'MANAGEMENT';
export type ActivityStatusCode = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface ActivityEvidenceDto {
  readonly id: string;
  readonly originalName: string;
  readonly mimeType: string | null;
  readonly sizeBytes: number;
  readonly createdAt: string;
}

export interface ActivityDetailDto extends ActivityListItemDto {
  readonly evidences: readonly ActivityEvidenceDto[];
}

export interface ActivityChangeLogEntry {
  readonly id: string;
  readonly field: string;
  readonly fieldLabel: string;
  readonly oldValue: string | null;
  readonly newValue: string | null;
  readonly changedAt: string;
  readonly changedByName: string | null;
}

export interface ActivityChangeLogList {
  readonly items: readonly ActivityChangeLogEntry[];
  readonly total: number;
}

export interface ActivityListItemDto {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: ActivityCategoryCode;
  readonly workloadHours: number;
  readonly score: number;
  readonly status: ActivityStatusCode;
  readonly term: string;
  readonly kind: string;
  readonly rejectionReason?: string | null;
  readonly submittedAt?: string | null;
}

export interface ActivityCreatePayload {
  readonly title: string;
  readonly category: ActivityCategoryCode;
  readonly workloadHours: number;
  readonly description: string;
  readonly score: number;
  readonly term?: string;
  readonly kind?: string;
}

export interface ActivityCreateResponse extends ActivityListItemDto {}

export interface ActivityEvidenceUploadResponse {
  readonly id: string;
  readonly filename: string;
  readonly originalName: string;
  readonly size: number;
  readonly url?: string;
}

export interface ActivityScoreEstimate {
  readonly baseCategory: number;
  readonly workloadFactor: number;
  readonly totalImpact: number;
  readonly progressPercentage: number;
}

export interface ActivityScoreEstimateRequest {
  readonly category: ActivityCategoryCode;
  readonly workloadHours: number;
}

export interface ActivityListItemUi {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly categoria: 'Pesquisa' | 'Ensino' | 'Extensão' | 'Gestão';
  readonly score: number;
  readonly status: 'Validado' | 'Pendente' | 'Erro';
}

export interface ActivitiesListQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly search?: string;
  readonly category?: ActivityCategoryCode;
  readonly status?: ActivityStatusCode;
  readonly term?: string;
}

export interface PaginatedActivitiesResponse {
  readonly items: readonly ActivityListItemDto[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}
