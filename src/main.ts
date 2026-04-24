import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

async function loadRuntimeConfig(): Promise<void> {
  try {
    const response = await fetch('/app-config.json', { cache: 'no-store' });
    if (!response.ok) {
      return;
    }

    const config = (await response.json()) as unknown;
    if (typeof config !== 'object' || config === null) {
      return;
    }

    window.__APP_CONFIG__ = config as Record<string, unknown>;
  } catch {
    // ignore missing/invalid runtime config
  }
}

void loadRuntimeConfig().finally(() => {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
});
