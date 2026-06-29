import { AuthRole } from '../../auth/auth.models';

export interface AuthenticatedNavItem {
  readonly label: string;
  readonly icon: string;
  readonly route: string;
}

export interface AuthenticatedNavSection {
  readonly label: string;
  readonly requiredRole: AuthRole;
  readonly items: readonly AuthenticatedNavItem[];
}

export const DOCENTE_NAV_ITEMS: readonly AuthenticatedNavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Atividades', icon: 'assignment', route: '/atividades' },
  { label: 'Checklist', icon: 'checklist', route: '/checklist' },
  { label: 'Relatórios', icon: 'bar_chart', route: '/relatorios' },
  { label: 'Configurações', icon: 'settings', route: '/configuracoes' },
] as const;

export const EVALUATOR_NAV_ITEMS: readonly AuthenticatedNavItem[] = [
  { label: 'Fila de avaliação', icon: 'rate_review', route: '/avaliador' },
] as const;

export const ADMIN_NAV_ITEMS: readonly AuthenticatedNavItem[] = [
  { label: 'Usuários', icon: 'group', route: '/admin/usuarios' },
] as const;

export const AUTHENTICATED_NAV_SECTIONS: readonly AuthenticatedNavSection[] = [
  { label: 'Meu progresso', requiredRole: 'USER', items: DOCENTE_NAV_ITEMS },
  { label: 'Avaliação', requiredRole: 'EVALUATOR', items: EVALUATOR_NAV_ITEMS },
  { label: 'Administração', requiredRole: 'ADMIN', items: ADMIN_NAV_ITEMS },
] as const;

/** @deprecated Use AUTHENTICATED_NAV_SECTIONS */
export const AUTHENTICATED_NAV_ITEMS: readonly AuthenticatedNavItem[] = DOCENTE_NAV_ITEMS;

export function buildNavSectionsForRoles(
  roles: readonly AuthRole[],
): AuthenticatedNavSection[] {
  return AUTHENTICATED_NAV_SECTIONS.filter((section) =>
    roles.includes(section.requiredRole),
  );
}

export function flattenNavSections(
  sections: readonly AuthenticatedNavSection[],
): AuthenticatedNavItem[] {
  return sections.flatMap((section) => [...section.items]);
}
