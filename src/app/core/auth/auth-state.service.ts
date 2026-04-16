import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from './auth-api.service';
import {
  AuthCredentials,
  AuthResponse,
  AuthSession,
  AuthSessionOptions,
  DashboardUser,
  ForgotPasswordResponse,
  RegisterPayload,
  TokenPair,
} from './auth.models';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly authApiService = inject(AuthApiService);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly sessionState = signal<AuthSession | null>(
    this.tokenStorageService.readSession(),
  );
  private readonly sessionValidationStatus = signal<'unknown' | 'valid' | 'invalid'>(
    this.sessionState() ? 'unknown' : 'invalid',
  );
  private sessionValidationPromise: Promise<boolean> | null = null;
  private refreshSessionPromise: Promise<boolean> | null = null;

  readonly session = this.sessionState.asReadonly();
  readonly currentUser = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.session() !== null);

  async login(
    credentials: AuthCredentials,
    options: AuthSessionOptions = { persist: true },
  ): Promise<void> {
    const response = await firstValueFrom(this.authApiService.login(credentials));
    this.persistSession(this.createSession(response, options.persist), options.persist);
  }

  async register(
    payload: RegisterPayload,
    options: AuthSessionOptions = { persist: true },
  ): Promise<void> {
    const response = await firstValueFrom(this.authApiService.register(payload));
    this.persistSession(this.createSession(response, options.persist), options.persist);
  }

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return firstValueFrom(this.authApiService.forgotPassword(email));
  }

  async ensureSessionValid(): Promise<boolean> {
    let session = this.session();

    if (!session) {
      session = this.tokenStorageService.readSession();

      if (session) {
        this.sessionState.set(session);
        this.sessionValidationStatus.set('unknown');
      }
    }

    if (!session) {
      this.sessionValidationStatus.set('invalid');
      return false;
    }

    if (this.sessionValidationStatus() === 'valid') {
      return true;
    }

    if (this.sessionValidationStatus() === 'invalid') {
      return false;
    }

    if (!this.sessionValidationPromise) {
      this.sessionValidationPromise = this.validateStoredSession().finally(() => {
        this.sessionValidationPromise = null;
      });
    }

    return this.sessionValidationPromise;
  }

  async logout(): Promise<void> {
    const session = this.session();

    this.clearSession();

    if (!session) {
      return;
    }

    void firstValueFrom(this.authApiService.logout(session.refreshToken)).catch(() => undefined);
  }

  async refreshSession(): Promise<boolean> {
    const session = this.session();

    if (!session?.refreshToken) {
      this.clearSession();
      return false;
    }

    if (!this.refreshSessionPromise) {
      this.refreshSessionPromise = this.refreshSessionInternal(session).finally(() => {
        this.refreshSessionPromise = null;
      });
    }

    return this.refreshSessionPromise;
  }

  getAccessToken(): string | null {
    return this.session()?.accessToken ?? null;
  }

  hasRefreshToken(): boolean {
    return Boolean(this.session()?.refreshToken);
  }

  clearSession(): void {
    this.sessionState.set(null);
    this.tokenStorageService.clearSession();
    this.sessionValidationStatus.set('invalid');
  }

  private persistSession(session: AuthSession, persist: boolean): void {
    this.sessionState.set(session);
    this.tokenStorageService.saveSession(session, persist);
    this.sessionValidationStatus.set('valid');
  }

  private createSession(response: AuthResponse, persistent: boolean): AuthSession {
    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      user: this.toDashboardUser(response.user),
      issuedAt: new Date().toISOString(),
      persistent,
    };
  }

  private toDashboardUser(user: AuthResponse['user']): DashboardUser {
    return {
      ...user,
      title: user.role === 'ADMIN' ? 'Administrador' : 'Prof. Associado IV',
      avatarInitials: this.buildInitials(user.name),
    };
  }

  private buildInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  private async validateStoredSession(): Promise<boolean> {
    try {
      const user = await firstValueFrom(this.authApiService.me());
      const currentSession = this.session();

      if (!currentSession) {
        return false;
      }

      this.persistSession(
        {
          ...currentSession,
          user: this.toDashboardUser(user),
        },
        currentSession.persistent,
      );

      return true;
    } catch {
      this.clearSession();
      return false;
    }
  }

  private async refreshSessionInternal(currentSession: AuthSession): Promise<boolean> {
    try {
      const refreshedTokens = await firstValueFrom(
        this.authApiService.refresh(currentSession.refreshToken),
      );
      this.persistSession(
        this.mergeSessionWithTokenPair(currentSession, refreshedTokens),
        currentSession.persistent,
      );
      return true;
    } catch {
      this.clearSession();
      return false;
    }
  }

  private mergeSessionWithTokenPair(session: AuthSession, tokenPair: TokenPair): AuthSession {
    return {
      ...session,
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      issuedAt: new Date().toISOString(),
    };
  }
}
