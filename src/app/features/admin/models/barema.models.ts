import { ActivityCategoryCode } from '../../atividades/models/activity-create.models';

export interface BaremaConfig {
  readonly id: string;
  readonly scoreTarget: number;
  readonly isActive: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly categoryRules: readonly BaremaCategoryRule[];
  readonly activityRules: readonly BaremaActivityRule[];
}

export interface BaremaCategoryRule {
  readonly id: string;
  readonly baremaConfigId: string;
  readonly category: ActivityCategoryCode;
  readonly baseScore: number;
  readonly workloadMultiplier: number;
  readonly ceilingScore: number;
  readonly minimumTarget: number;
}

export interface BaremaActivityRule {
  readonly id: string;
  readonly baremaConfigId: string;
  readonly category: ActivityCategoryCode;
  readonly kind: string;
  readonly keywords: readonly string[];
  readonly fixedScore: number | null;
  readonly workloadMultiplier: number | null;
  readonly priority: number;
  readonly isActive: boolean;
}

export interface UpdateBaremaConfigPayload {
  readonly scoreTarget?: number;
  readonly isActive?: boolean;
}

export interface UpdateBaremaCategoryRulePayload {
  readonly baseScore?: number;
  readonly workloadMultiplier?: number;
  readonly ceilingScore?: number;
  readonly minimumTarget?: number;
}

export interface CreateBaremaActivityRulePayload {
  readonly category: ActivityCategoryCode;
  readonly kind: string;
  readonly keywords?: readonly string[];
  readonly fixedScore?: number | null;
  readonly workloadMultiplier?: number | null;
  readonly priority?: number;
  readonly isActive?: boolean;
}

export interface UpdateBaremaActivityRulePayload {
  readonly category?: ActivityCategoryCode;
  readonly kind?: string;
  readonly keywords?: readonly string[];
  readonly fixedScore?: number | null;
  readonly workloadMultiplier?: number | null;
  readonly priority?: number;
  readonly isActive?: boolean;
}

export const BAREMA_CATEGORY_LABELS: Record<ActivityCategoryCode, string> = {
  TEACHING: 'Ensino',
  RESEARCH: 'Pesquisa',
  OUTREACH: 'Extensão',
  MANAGEMENT: 'Gestão',
};
