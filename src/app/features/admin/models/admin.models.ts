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
