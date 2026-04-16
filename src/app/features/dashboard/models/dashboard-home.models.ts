export interface DashboardHomePillar {
  readonly label: string;
  readonly score: number;
  readonly total: number;
  readonly percentage: number;
  readonly accent: string;
}

export type DashboardNotificationTone = 'warning' | 'success' | 'info';

export interface DashboardHomeNotification {
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly icon: string;
  readonly tone: DashboardNotificationTone;
}

export interface DashboardHomeScore {
  readonly current: number;
  readonly target: number;
}

export interface DashboardHomeCareer {
  readonly currentLevelLabel: string;
  readonly nextLevelLabel: string;
  readonly progressPercentage: number;
  readonly yearsInLevel: number;
  readonly yearsRequired: number;
  readonly qualisPublications: number;
  readonly qualisTarget: number;
  readonly supervisions: number;
  readonly supervisionsTarget: number;
}

export interface DashboardHomeBiennium {
  readonly cycleLabel: string;
  readonly completionPercentage: number;
  readonly departmentComparison: string;
}

export interface DashboardHomeData {
  readonly displayName: string;
  readonly roleLabel: string;
  readonly summary: string;
  readonly score: DashboardHomeScore;
  readonly career: DashboardHomeCareer;
  readonly pillars: readonly DashboardHomePillar[];
  readonly biennium: DashboardHomeBiennium;
  readonly notifications: readonly DashboardHomeNotification[];
}
