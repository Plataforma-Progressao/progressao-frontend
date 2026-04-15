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

      return {
        ...parsedSession,
        persistent: parsedSession.persistent ?? persistent,
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

    return Boolean(
      session.accessToken &&
      session.refreshToken &&
      session.issuedAt &&
      session.user?.id &&
      session.user?.email &&
      session.user?.name,
    );
  }
}
