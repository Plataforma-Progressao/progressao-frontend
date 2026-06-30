import { AuthRole } from '../../../core/auth/auth.models';

export interface AdminUserListItem {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly roles: readonly AuthRole[];
  readonly department: string | null;
  readonly university: string | null;
  readonly createdAt: string;
}

export interface AdminUsersQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly search?: string;
  readonly role?: AuthRole;
}

export interface PaginatedAdminUsersResponse {
  readonly items: readonly AdminUserListItem[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

export interface CreateAdminUserPayload {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly roles: AuthRole[];
  readonly university?: string;
  readonly department?: string;
  readonly careerClass?: string;
  readonly currentLevel?: string;
  readonly lastProgressionDate?: string;
}

export interface UpdateAdminUserRolesPayload {
  readonly roles: AuthRole[];
}

export const ROLE_LABELS: Record<AuthRole, string> = {
  USER: 'Docente',
  EVALUATOR: 'Revisor',
  ADMIN: 'Administrador',
};

export interface AdminDashboardUserCounts {
  readonly teachers: number;
  readonly evaluators: number;
  readonly admins: number;
}

export interface AdminDashboardUnassignedTeacher {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly department: string | null;
}

export interface AdminDashboardEvaluatorLoad {
  readonly evaluatorId: string;
  readonly evaluatorName: string;
  readonly evaluatorEmail: string;
  readonly teacherCount: number;
  readonly pendingCount: number;
}

export interface AdminDashboardRecentAssignment {
  readonly teacherName: string;
  readonly teacherEmail: string;
  readonly evaluatorName: string;
  readonly assignedAt: string;
}

export interface AdminDashboardHomeData {
  readonly displayName: string;
  readonly summary: string;
  readonly userCounts: AdminDashboardUserCounts;
  readonly unassignedTeacherCount: number;
  readonly unassignedTeachers: readonly AdminDashboardUnassignedTeacher[];
  readonly orphanPendingActivityCount: number;
  readonly evaluatorLoads: readonly AdminDashboardEvaluatorLoad[];
  readonly recentAssignments: readonly AdminDashboardRecentAssignment[];
}

export interface EvaluatorAssignmentTeacher {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly department: string | null;
}

export interface EvaluatorAssignmentEvaluator {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export interface EvaluatorAssignmentListItem {
  readonly teacher: EvaluatorAssignmentTeacher;
  readonly evaluator: EvaluatorAssignmentEvaluator | null;
  readonly assignedAt: string | null;
}

export interface EvaluatorAssignmentsQuery {
  readonly page: number;
  readonly pageSize: number;
  readonly search?: string;
  readonly unassignedOnly?: boolean;
  readonly evaluatorId?: string;
}

export interface PaginatedEvaluatorAssignmentsResponse {
  readonly items: readonly EvaluatorAssignmentListItem[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

export interface AssignEvaluatorPayload {
  readonly evaluatorId: string;
}
