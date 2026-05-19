export type ActivityCategoryCode = 'TEACHING' | 'RESEARCH' | 'OUTREACH' | 'MANAGEMENT';
export type ActivityStatusCode = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ActivityListItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: ActivityCategoryCode;
  readonly workloadHours: number;
  readonly score: number;
  readonly status: ActivityStatusCode;
  readonly term: string;
  readonly kind: string;
}

export interface ActivityCreatePayload {
  readonly title: string;
  readonly category: ActivityCategoryCode;
  readonly workloadHours: number;
  readonly description: string;
}

export interface ActivityUpdatePayload {
  readonly title?: string;
  readonly category?: ActivityCategoryCode;
  readonly workloadHours?: number;
  readonly description?: string;
}

export interface ActivityCreateResponse extends ActivityListItem {}

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
