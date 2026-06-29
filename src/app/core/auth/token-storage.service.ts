import { Injectable } from '@angular/core';
import { AuthSession } from './auth.models';

const SESSION_STORAGE_KEY = 'plataforma-progressao.auth.session';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  readSession(): AuthSession | null {
    const localSession = this.readFromStorage(localStorage, true);

    if (localSession) {
      return localSession;
    }

    return this.readFromStorage(sessionStorage, false);
  }

  saveSession(session: AuthSession, persist: boolean): void {
    this.clearSession();
    const storage = persist ? localStorage : sessionStorage;
    storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }

  clearSession(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }

  private readFromStorage(storage: Storage, persistent: boolean): AuthSession | null {
    const rawSession = storage.getItem(SESSION_STORAGE_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      const parsedSession = JSON.parse(rawSession) as Partial<AuthSession>;

      if (!this.isValidSession(parsedSession)) {
        storage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }

      const normalized = this.normalizeSession(parsedSession);

      return {
        ...normalized,
        persistent: normalized.persistent ?? persistent,
      } as AuthSession;
    } catch {
      storage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
  }

  private isValidSession(session: Partial<AuthSession> | null): session is Partial<AuthSession> {
    if (!session) {
      return false;
    }

    const user = session.user as
      | (Partial<AuthSession['user']> & { role?: string })
      | undefined;

    return Boolean(
      session.accessToken &&
      session.refreshToken &&
      session.issuedAt &&
      user?.id &&
      user?.email &&
      user?.name &&
      (user.roles?.length || user.role),
    );
  }

  private normalizeSession(session: Partial<AuthSession>): Partial<AuthSession> {
    const user = session.user as
      | (Partial<AuthSession['user']> & { role?: string })
      | undefined;

    if (!user) {
      return session;
    }

    const roles =
      user.roles ??
      (user.role ? [user.role as AuthSession['user']['roles'][number]] : ['USER']);

    return {
      ...session,
      user: {
        ...user,
        roles,
      } as AuthSession['user'],
    };
  }
}
