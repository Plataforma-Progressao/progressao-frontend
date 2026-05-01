export type ActivityCategory = 'TEACHING' | 'RESEARCH' | 'OUTREACH' | 'MANAGEMENT';
export type ActivityStatus = 'APPROVED' | 'PENDING' | 'REJECTED';

export interface ReportActivity {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: ActivityCategory;
  readonly workloadHours: number;
  readonly score: number;
  readonly status: ActivityStatus;
  readonly term: string;
  readonly kind: string;
}

export interface ReportTeacherProfile {
  readonly id: string;
  readonly name: string;
  readonly siapeId: string;
  readonly department: string;
  readonly workRegime: string;
}

export interface ReportInstitutionMetadata {
  readonly institution: string;
  readonly graduateOfficeTitle: string;
  readonly documentLabel: string;
  readonly cycleLabel: string;
  readonly issuedAtLabel: string;
  readonly cycleStatus: string;
}

export interface RadReportPayload {
  readonly userData: ReportTeacherProfile;
  readonly metadata: ReportInstitutionMetadata;
  readonly activities: readonly ReportActivity[];
}

const VALID_CATEGORIES: readonly ActivityCategory[] = ['TEACHING', 'RESEARCH', 'OUTREACH', 'MANAGEMENT'];
const VALID_STATUSES: readonly ActivityStatus[] = ['APPROVED', 'PENDING', 'REJECTED'];

const DEFAULT_USER: ReportTeacherProfile = {
  id: 'unknown',
  name: 'Docente nao identificado',
  siapeId: 'N/A',
  department: 'Departamento nao informado',
  workRegime: 'Regime nao informado',
};

const DEFAULT_METADATA: ReportInstitutionMetadata = {
  institution: 'Universidade Federal do Conhecimento',
  graduateOfficeTitle: 'Pro-Reitoria de Graduacao e Pesquisa',
  documentLabel: 'Documento preliminar',
  cycleLabel: 'Ciclo nao informado',
  issuedAtLabel: 'Data nao informada',
  cycleStatus: 'Sem status',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizeString(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function sanitizeNonNegativeNumber(value: unknown): number {
  if (typeof value !== 'number' || Number.isNaN(value) || value < 0) {
    return 0;
  }

  return value;
}

function sanitizeCategory(value: unknown): ActivityCategory {
  if (typeof value !== 'string') {
    return 'MANAGEMENT';
  }

  return VALID_CATEGORIES.includes(value as ActivityCategory) ? (value as ActivityCategory) : 'MANAGEMENT';
}

function sanitizeStatus(value: unknown): ActivityStatus {
  if (typeof value !== 'string') {
    return 'PENDING';
  }

  return VALID_STATUSES.includes(value as ActivityStatus) ? (value as ActivityStatus) : 'PENDING';
}

function sanitizeUserData(value: unknown): ReportTeacherProfile {
  if (!isRecord(value)) {
    return DEFAULT_USER;
  }

  return {
    id: sanitizeString(value['id'], DEFAULT_USER.id),
    name: sanitizeString(value['name'], DEFAULT_USER.name),
    siapeId: sanitizeString(value['siapeId'], DEFAULT_USER.siapeId),
    department: sanitizeString(value['department'], DEFAULT_USER.department),
    workRegime: sanitizeString(value['workRegime'], DEFAULT_USER.workRegime),
  };
}

function sanitizeMetadata(value: unknown): ReportInstitutionMetadata {
  if (!isRecord(value)) {
    return DEFAULT_METADATA;
  }

  return {
    institution: sanitizeString(value['institution'], DEFAULT_METADATA.institution),
    graduateOfficeTitle: sanitizeString(
      value['graduateOfficeTitle'],
      DEFAULT_METADATA.graduateOfficeTitle,
    ),
    documentLabel: sanitizeString(value['documentLabel'], DEFAULT_METADATA.documentLabel),
    cycleLabel: sanitizeString(value['cycleLabel'], DEFAULT_METADATA.cycleLabel),
    issuedAtLabel: sanitizeString(value['issuedAtLabel'], DEFAULT_METADATA.issuedAtLabel),
    cycleStatus: sanitizeString(value['cycleStatus'], DEFAULT_METADATA.cycleStatus),
  };
}

function sanitizeActivity(value: unknown, index: number): ReportActivity {
  if (!isRecord(value)) {
    return {
      id: `activity-${index + 1}`,
      title: `Activity ${index + 1}`,
      description: 'Descricao nao informada',
      category: 'MANAGEMENT',
      workloadHours: 0,
      score: 0,
      status: 'PENDING',
      term: '-',
      kind: '-',
    };
  }

  return {
    id: sanitizeString(value['id'], `activity-${index + 1}`),
    title: sanitizeString(value['title'], `Activity ${index + 1}`),
    description: sanitizeString(value['description'], 'Descricao nao informada'),
    category: sanitizeCategory(value['category']),
    workloadHours: sanitizeNonNegativeNumber(value['workloadHours']),
    score: sanitizeNonNegativeNumber(value['score']),
    status: sanitizeStatus(value['status']),
    term: sanitizeString(value['term'], '-'),
    kind: sanitizeString(value['kind'], '-'),
  };
}

export function normalizeReportPayload(payload: unknown): RadReportPayload {
  if (!isRecord(payload)) {
    return {
      userData: DEFAULT_USER,
      metadata: DEFAULT_METADATA,
      activities: [],
    };
  }

  const rawActivities = payload['activities'];
  const activities = Array.isArray(rawActivities)
    ? rawActivities.map((item, index) => sanitizeActivity(item, index))
    : [];

  return {
    userData: sanitizeUserData(payload['userData']),
    metadata: sanitizeMetadata(payload['metadata']),
    activities,
  };
}
