export interface DashboardNavItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

export interface DashboardPillarProgress {
  readonly label: string;
  readonly score: number;
  readonly total: number;
  readonly percentage: number;
  readonly accent: string;
}

export interface DashboardNotificationItem {
  readonly title: string;
  readonly description: string;
  readonly timestamp: string;
  readonly icon: string;
  readonly tone: 'warning' | 'success' | 'info';
}

export const DASHBOARD_NAV_ITEMS: readonly DashboardNavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Atividades', icon: 'assignment', route: '/dashboard/atividades' },
  { label: 'Histórico', icon: 'history', route: '/dashboard/historico' },
  { label: 'Checklist', icon: 'checklist', route: '/dashboard/checklist' },
  { label: 'Relatórios', icon: 'bar_chart', route: '/dashboard/relatorios' },
  { label: 'Configurações', icon: 'settings', route: '/dashboard/configuracoes' },
] as const;

export const DASHBOARD_PILLARS: readonly DashboardPillarProgress[] = [
  { label: 'Ensino', score: 420, total: 420, percentage: 30, accent: '#5a54ea' },
  { label: 'Pesquisa', score: 680, total: 680, percentage: 48, accent: '#14b48b' },
  { label: 'Extensão', score: 210, total: 210, percentage: 15, accent: '#f59e0b' },
  { label: 'Gestão', score: 110, total: 110, percentage: 7, accent: '#9ca3af' },
] as const;

export const DASHBOARD_NOTIFICATIONS: readonly DashboardNotificationItem[] = [
  {
    title: 'Pendente: Relatório de Progressão',
    description:
      'O prazo para envio do relatório parcial encerra em 3 dias. Evite atrasos na sua contagem de pontos.',
    timestamp: 'Há 2 horas',
    icon: 'warning_amber',
    tone: 'warning',
  },
  {
    title: 'Artigo Validado',
    description:
      'Sua publicação no "Journal of Academic Growth" foi validada pela comissão. +40 pontos adicionados.',
    timestamp: 'Ontem',
    icon: 'verified',
    tone: 'success',
  },
  {
    title: 'Nova Orientação de Doutorado',
    description:
      'O discente Carlos Alberto selecionou você como orientador. Aceite a solicitação no sistema.',
    timestamp: '2 dias atrás',
    icon: 'school',
    tone: 'info',
  },
] as const;
