export interface AuthenticatedNavItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

export const AUTHENTICATED_NAV_ITEMS: readonly AuthenticatedNavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Atividades', icon: 'assignment', route: '/atividades' },
  { label: 'Checklist', icon: 'checklist', route: '/checklist' },
  { label: 'Relatórios', icon: 'bar_chart', route: '/relatorios' },
  { label: 'Configurações', icon: 'settings', route: '/configuracoes' },
] as const;
