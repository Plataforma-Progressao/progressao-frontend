import { environment } from '../../../environments/environment';

export interface RuntimeConfig {
  readonly apiUrl?: string;
}

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig;
  }
}

export function getApiUrl(): string {
  const runtimeApiUrl = window.__APP_CONFIG__?.apiUrl?.trim();
  if (runtimeApiUrl) {
    return runtimeApiUrl;
  }

  return environment.apiUrl;
}

