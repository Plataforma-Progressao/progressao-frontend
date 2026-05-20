export type ActivityCategoryCode = 'TEACHING' | 'RESEARCH' | 'OUTREACH' | 'MANAGEMENT';

export interface ActivityCreatePayload {
  readonly title: string;
  readonly category: ActivityCategoryCode;
  readonly workloadHours: number;
  readonly description: string;
  readonly score: number;
  readonly term?: string;
  readonly kind?: string;
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
  readonly baseCategory: number;
  readonly workloadFactor: number;
  readonly totalImpact: number;
  readonly progressPercentage: number;
}

export interface ActivityScoreEstimateRequest {
  readonly category: ActivityCategoryCode;
  readonly workloadHours: number;
}
