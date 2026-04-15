export type AuthRole = 'ADMIN' | 'USER';

export interface AuthCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterPayload {
  readonly fullName: string;
  readonly cpf: string;
  readonly email: string;
  readonly university: string;
  readonly center: string;
  readonly department: string;
  readonly practiceAreas: string[];
  readonly careerClass: string;
  readonly currentLevel: string;
  readonly lastProgressionDate: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly acceptTerms: boolean;
  readonly acceptLgpd: boolean;
}

export interface AuthResponseUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: AuthRole;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface AuthResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: AuthResponseUser;
}

export interface TokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface LogoutResponse {
  readonly revoked: true;
}

export interface AuthSessionOptions {
  readonly persist: boolean;
}

export interface DashboardUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: AuthRole;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly title: string;
  readonly avatarInitials: string;
}

export interface AuthSession {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly user: DashboardUser;
  readonly issuedAt: string;
  readonly persistent: boolean;
}
