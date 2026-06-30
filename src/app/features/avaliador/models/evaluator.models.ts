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

export type ChecklistItemStatus = 'PENDING' | 'ATTENTION' | 'COMPLETED';

export interface EvaluatorDashboardSummary {
  readonly assignedTeacherCount: number;
  readonly pendingCount: number;
  readonly pendingChecklistCount: number;
  readonly approvedLast30Days: number;
  readonly rejectedLast30Days: number;
}

export interface EvaluatorChecklistTeacher {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly department: string | null;
}

export interface EvaluatorChecklistTemplate {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
}

export interface EvaluatorChecklistListItem {
  readonly id: string;
  readonly status: ChecklistItemStatus;
  readonly note: string | null;
  readonly submittedAt: string | null;
  readonly teacher: EvaluatorChecklistTeacher;
  readonly template: EvaluatorChecklistTemplate;
}

export interface EvaluatorChecklistDetail extends EvaluatorChecklistListItem {
  readonly reviewedAt: string | null;
  readonly template: EvaluatorChecklistTemplate & {
    readonly createdAt?: string;
    readonly updatedAt?: string;
  };
}

export interface EvaluatorChecklistQuery {
  readonly teacherId?: string;
  readonly status?: ChecklistItemStatus;
}

export interface RejectChecklistItemPayload {
  readonly note: string;
}

export interface EvaluatorDashboardTeacher {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly department: string | null;
  readonly pendingCount: number;
}

export interface EvaluatorDashboardPendingActivity {
  readonly id: string;
  readonly title: string;
  readonly teacherName: string;
  readonly category: string;
  readonly submittedAt: string | null;
}

export interface EvaluatorDashboardCategoryBreakdown {
  readonly category: string;
  readonly label: string;
  readonly pendingCount: number;
}

export interface EvaluatorDashboardHomeData {
  readonly displayName: string;
  readonly summary: string;
  readonly summaryStats: EvaluatorDashboardSummary;
  readonly teachers: readonly EvaluatorDashboardTeacher[];
  readonly pendingActivities: readonly EvaluatorDashboardPendingActivity[];
  readonly categoryBreakdown: readonly EvaluatorDashboardCategoryBreakdown[];
}
