export type ChecklistItemStatusCode = 'PENDING' | 'ATTENTION' | 'COMPLETED';

export interface ChecklistHomeItem {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly status: ChecklistItemStatusCode;
  readonly note: string | null;
  readonly submittedAt: string | null;
  readonly updatedAt: string;
}

export interface ChecklistHomeData {
  readonly total: number;
  readonly completed: number;
  readonly attention: number;
  readonly pending: number;
  readonly completionPercentage: number;
  readonly items: readonly ChecklistHomeItem[];
}

export interface UpdateChecklistItemPayload {
  readonly status: ChecklistItemStatusCode;
  readonly note?: string;
}
