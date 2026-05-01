import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from '../../../../core/auth/auth-api.service';
import { AuthStateService } from '../../../../core/auth/auth-state.service';
import { NotificationService } from '../../../../core/notifications/notification.service';
import { ButtonComponent, InputComponent } from '../../../../shared';

@Component({
  selector: 'app-configuracoes-home',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './configuracoes-home.page.html',
  styleUrl: './configuracoes-home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracoesHomePage {
  private readonly fb = inject(FormBuilder);
  private readonly authApiService = inject(AuthApiService);
  private readonly authStateService = inject(AuthStateService);
  private readonly notificationService = inject(NotificationService);

  protected readonly emailFieldTooltip =
    'O e-mail institucional não pode ser alterado por aqui. Em caso de mudança, contate a secretaria.';

  protected readonly hideNewPassword = signal(true);
  protected readonly hideConfirmPassword = signal(true);
  protected readonly hideCurrentPassword = signal(true);
  protected readonly saving = signal(false);

  protected readonly profileResource = resource({
    loader: () => firstValueFrom(this.authApiService.me()),
  });

  protected readonly profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }],
    lattesUrl: [''],
    orcid: [''],
    currentPassword: [''],
    newPassword: [''],
    confirmNewPassword: [''],
  });

  protected readonly isLoading = computed(() => this.profileResource.status() === 'loading');
  protected readonly loadError = computed(() => this.profileResource.status() === 'error');

  protected readonly avatarInitials = computed(() => {
    const fromApi = this.profileResource.value()?.name;
    const fromForm = this.profileForm.controls.name.value ?? '';
    const name = (fromApi?.trim() || fromForm.trim() || '?').trim();
    return this.buildInitials(name);
  });

  constructor() {
    effect(() => {
      const profile = this.profileResource.value();
      if (!profile) {
        return;
      }

      this.profileForm.patchValue({
        name: profile.name,
        email: profile.email,
        lattesUrl: profile.lattesUrl ?? '',
        orcid: profile.orcid ?? '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    });
  }

  protected toggleNewPasswordVisibility(): void {
    this.hideNewPassword.update((v) => !v);
  }

  protected toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update((v) => !v);
  }

  protected toggleCurrentPasswordVisibility(): void {
    this.hideCurrentPassword.update((v) => !v);
  }

  protected onCancel(): void {
    const profile = this.profileResource.value();
    if (!profile) {
      void this.profileResource.reload();
      return;
    }

    this.profileForm.patchValue({
      name: profile.name,
      email: profile.email,
      lattesUrl: profile.lattesUrl ?? '',
      orcid: profile.orcid ?? '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  }

  protected async onSubmit(): Promise<void> {
    this.profileForm.markAllAsTouched();

    if (this.profileForm.controls.name.invalid) {
      this.notificationService.error('Corrija o nome antes de salvar.');
      return;
    }

    const raw = this.profileForm.getRawValue();
    const newPw = (raw.newPassword ?? '').trim();
    const confirmPw = (raw.confirmNewPassword ?? '').trim();
    const currentPw = raw.currentPassword ?? '';

    if (newPw || confirmPw) {
      if (newPw.length < 8) {
        this.notificationService.error('A nova senha deve ter pelo menos 8 caracteres.');
        return;
      }

      if (newPw !== confirmPw) {
        this.notificationService.error('A confirmação da nova senha não confere.');
        return;
      }

      if (!currentPw.trim()) {
        this.notificationService.error('Informe a senha atual para definir uma nova senha.');
        return;
      }
    }

    const payload: {
      name: string;
      lattesUrl?: string;
      orcid?: string;
      currentPassword?: string;
      newPassword?: string;
    } = {
      name: (raw.name ?? '').trim(),
    };

    const lattes = (raw.lattesUrl ?? '').trim();
    const orcid = (raw.orcid ?? '').trim();

    if (lattes.length > 0) {
      payload.lattesUrl = lattes;
    } else {
      payload.lattesUrl = '';
    }

    if (orcid.length > 0) {
      payload.orcid = orcid;
    } else {
      payload.orcid = '';
    }

    if (newPw) {
      payload.currentPassword = currentPw.trim();
      payload.newPassword = newPw;
    }

    this.saving.set(true);

    try {
      const updated = await firstValueFrom(this.authApiService.updateProfile(payload));
      this.authStateService.applyAuthUser(updated);
      this.profileForm.patchValue({
        name: updated.name,
        email: updated.email,
        lattesUrl: updated.lattesUrl ?? '',
        orcid: updated.orcid ?? '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      await this.profileResource.reload();
      this.notificationService.success('Perfil atualizado com sucesso.');
    } catch (error: unknown) {
      this.notificationService.error(this.resolveSaveError(error));
    } finally {
      this.saving.set(false);
    }
  }

  protected openLattesInNewTab(): void {
    const url = this.normalizeExternalUrl(this.lattesUrlForActions());
    if (!url) {
      return;
    }

    const opened = globalThis.window?.open(url, '_blank', 'noopener,noreferrer');
    opened?.focus();
  }

  protected openOrcidInNewTab(): void {
    const id = this.orcidIdForActions();
    if (!id) {
      return;
    }

    const path = id.replace(/^https?:\/\/orcid\.org\//i, '').replace(/^\//, '');
    const url = `https://orcid.org/${path}`;
    const opened = globalThis.window?.open(url, '_blank', 'noopener,noreferrer');
    opened?.focus();
  }

  protected async copyOrcid(): Promise<void> {
    const id = this.orcidIdForActions();
    if (!id || !globalThis.navigator?.clipboard) {
      return;
    }

    const text = id.replace(/^https?:\/\/orcid\.org\//i, '').replace(/^\//, '');
    await globalThis.navigator.clipboard.writeText(text);
  }

  /** Valor efetivo para ações: formulário (digitação) ou último perfil carregado da API. */
  private lattesUrlForActions(): string {
    const fromForm = (this.profileForm.controls.lattesUrl.value ?? '').trim();
    if (fromForm.length > 0) {
      return fromForm;
    }

    return (this.profileResource.value()?.lattesUrl ?? '').trim();
  }

  private orcidIdForActions(): string {
    const fromForm = (this.profileForm.controls.orcid.value ?? '').trim();
    if (fromForm.length > 0) {
      return fromForm;
    }

    return (this.profileResource.value()?.orcid ?? '').trim();
  }

  private normalizeExternalUrl(raw: string): string | null {
    const t = raw.trim();
    if (!t) {
      return null;
    }

    if (/^https?:\/\//i.test(t)) {
      return t;
    }

    return `https://${t}`;
  }

  private buildInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  private resolveSaveError(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error;
      if (typeof body === 'string' && body.trim()) {
        return body;
      }

      if (body && typeof body === 'object' && 'message' in body) {
        const msg = (body as { message?: unknown }).message;
        if (Array.isArray(msg) && typeof msg[0] === 'string') {
          return msg[0];
        }

        if (typeof msg === 'string' && msg.trim()) {
          return msg;
        }
      }
    }

    return 'Não foi possível salvar as alterações. Verifique os dados e tente novamente.';
  }
}
