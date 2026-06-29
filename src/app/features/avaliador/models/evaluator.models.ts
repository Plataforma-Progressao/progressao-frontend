import { ActivityCategoryCode, ActivityStatusCode } from '../../atividades/models/activity-create.models';
import { ActivityEvidenceDto } from '../../atividades/models/activity-create.models';

export interface EvaluatorTeacherSummary {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly department: string | null;
}

export interface EvaluatorActivityQueueItem {
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
  readonly teacher: EvaluatorTeacherSummary;
}

export interface EvaluatorActivitiesQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly search?: string;
  readonly category?: ActivityCategoryCode;
  readonly status?: ActivityStatusCode;
}

export interface PaginatedEvaluatorActivitiesResponse {
  readonly items: readonly EvaluatorActivityQueueItem[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

export interface EvaluatorActivityDetail extends EvaluatorActivityQueueItem {
  readonly reviewedAt: string | null;
  readonly teacher: EvaluatorTeacherSummary & {
    readonly university: string | null;
    readonly careerClass: string | null;
    readonly currentLevel: string | null;
  };
  readonly evidences: readonly ActivityEvidenceDto[];
  readonly statusHistory: readonly {
    readonly id: string;
    readonly fromStatus: string;
    readonly toStatus: string;
    readonly note: string | null;
    readonly changedAt: string;
    readonly changedByName: string | null;
  }[];
  readonly changeLogs: readonly {
    readonly id: string;
    readonly field: string;
    readonly fieldLabel: string;
    readonly oldValue: string | null;
    readonly newValue: string | null;
    readonly changedAt: string;
    readonly changedByName: string | null;
  }[];
}

export interface RejectActivityPayload {
  readonly rejectionReason: string;
}
