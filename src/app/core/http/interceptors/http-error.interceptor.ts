import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../notifications/notification.service';
import { SKIP_ERROR_TOAST } from './http-error-context.tokens';

const FALLBACK_ERROR_MESSAGE = 'Nao foi possivel concluir a operacao. Tente novamente.';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readStringField(source: Record<string, unknown>, key: string): string | null {
  const value = source[key];
  return typeof value === 'string' && value.trim() ? value : null;
}

function getErrorMessageFromPayload(payload: unknown): string | null {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  if (!isRecord(payload)) {
    return null;
  }

  const directMessage =
    readStringField(payload, 'message') ??
    readStringField(payload, 'error') ??
    readStringField(payload, 'detail') ??
    readStringField(payload, 'title');

  if (directMessage) {
    return directMessage;
  }

  const nestedError = payload['error'];
  if (isRecord(nestedError)) {
    return (
      readStringField(nestedError, 'message') ??
      readStringField(nestedError, 'detail') ??
      readStringField(nestedError, 'title')
    );
  }

  const errors = payload['errors'];
  if (Array.isArray(errors)) {
    const firstMessage = errors.find((item) => typeof item === 'string' && item.trim());
    if (typeof firstMessage === 'string') {
      return firstMessage;
    }
  }

  return null;
}

function getDefaultMessageByStatus(status: number): string {
  if (status === 0) {
    return 'Nao foi possivel conectar com o servidor. Verifique sua conexao.';
  }

  if (status === 400) {
    return 'Requisicao invalida. Revise os dados informados.';
  }

  if (status === 401) {
    return 'Sua sessao expirou. Faca login novamente.';
  }

  if (status === 403) {
    return 'Voce nao tem permissao para realizar esta acao.';
  }

  if (status === 404) {
    return 'Recurso nao encontrado.';
  }

  if (status >= 500) {
    return 'Erro interno no servidor. Tente novamente em instantes.';
  }

  return FALLBACK_ERROR_MESSAGE;
}

function resolveErrorMessage(error: HttpErrorResponse): string {
  return (
    getErrorMessageFromPayload(error.error) ??
    getDefaultMessageByStatus(error.status) ??
    (typeof error.message === 'string' && error.message.trim() ? error.message : null) ??
    FALLBACK_ERROR_MESSAGE
  );
}

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const notificationService = inject(NotificationService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (request.context.get(SKIP_ERROR_TOAST)) {
        return throwError(() => error);
      }

      if (error instanceof HttpErrorResponse) {
        notificationService.error(resolveErrorMessage(error));
      } else {
        notificationService.error(FALLBACK_ERROR_MESSAGE);
      }

      return throwError(() => error);
    }),
  );
};
