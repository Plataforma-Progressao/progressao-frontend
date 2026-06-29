import { AuthRole } from './auth.models';

export function getDefaultRouteForRoles(roles: readonly AuthRole[]): string {
  if (roles.includes('USER')) {
    return '/dashboard';
  }

  if (roles.includes('ADMIN')) {
    return '/admin';
  }

  if (roles.includes('EVALUATOR')) {
    return '/avaliador';
  }

  return '/login';
}

export function getRoleLabels(roles: readonly AuthRole[]): string[] {
  const labels: string[] = [];

  if (roles.includes('USER')) {
    labels.push('Docente');
  }

  if (roles.includes('EVALUATOR')) {
    labels.push('Revisor');
  }

  if (roles.includes('ADMIN')) {
    labels.push('Administrador');
  }

  return labels;
}
