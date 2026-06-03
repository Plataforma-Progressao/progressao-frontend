import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivityChangeLogEntry } from '../../models/activity-create.models';

@Component({
  selector: 'app-activity-change-log',
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="change-log" aria-labelledby="change-log-heading">
      <h2 id="change-log-heading" class="change-log__title">Histórico de alterações</h2>

      @if (loading()) {
        <p class="change-log__status" role="status">Carregando histórico...</p>
      } @else if (errorMessage()) {
        <div class="change-log__status change-log__status--error" role="alert">
          {{ errorMessage() }}
        </div>
      } @else if (sortedEntries().length === 0) {
        <p class="change-log__status">Nenhuma alteração registrada ainda.</p>
      } @else {
        <ol class="change-log__list">
          @for (entry of sortedEntries(); track entry.id) {
            <li class="change-log__item">
              <span class="change-log__icon" aria-hidden="true">
                <mat-icon>history</mat-icon>
              </span>
              <div class="change-log__body">
                <time class="change-log__time" [attr.datetime]="entry.changedAt">
                  {{ formatDateTime(entry.changedAt) }}
                </time>
                <p class="change-log__message">{{ formatMessage(entry) }}</p>
                @if (entry.changedByName) {
                  <p class="change-log__author">por {{ entry.changedByName }}</p>
                }
              </div>
            </li>
          }
        </ol>
      }
    </section>
  `,
  styles: `
    .change-log {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.25rem;
      border-radius: 1.75rem;
      background: var(--mat-sys-surface-container);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .change-log__title {
      margin: 0;
      font-size: 1.125rem;
      line-height: 1.75rem;
      color: var(--mat-sys-primary);
    }

    .change-log__status {
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.45;
      color: rgb(69 70 82);
    }

    .change-log__status--error {
      color: var(--mat-sys-error);
    }

    .change-log__list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .change-log__item {
      display: flex;
      gap: 0.75rem;
    }

    .change-log__icon mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
      color: rgb(118 118 131);
    }

    .change-log__time {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: rgb(118 118 131);
    }

    .change-log__message {
      margin: 0.25rem 0 0;
      font-size: 0.875rem;
      line-height: 1.45;
      color: rgb(26 28 29);
    }

    .change-log__author {
      margin: 0.125rem 0 0;
      font-size: 0.75rem;
      color: rgb(118 118 131);
    }
  `,
})
export class ActivityChangeLogComponent {
  readonly entries = input<readonly ActivityChangeLogEntry[]>([]);
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);

  protected readonly sortedEntries = computed(() =>
    [...this.entries()].sort(
      (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
    ),
  );

  protected formatDateTime(iso: string): string {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  }

  protected formatMessage(entry: ActivityChangeLogEntry): string {
    if (entry.field === '__created__') {
      return entry.newValue ?? 'Atividade criada.';
    }

    if (entry.oldValue && entry.newValue) {
      return `Alterou ${entry.fieldLabel} de "${entry.oldValue}" para "${entry.newValue}".`;
    }

    if (entry.newValue) {
      return `Definiu ${entry.fieldLabel} como "${entry.newValue}".`;
    }

    return `Removeu o valor de ${entry.fieldLabel}.`;
  }
}
