import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  imports: [MatIconModule],
  template: `
    <div class="flex items-center gap-2" [attr.aria-label]="'Paginação'">
      <button
        type="button"
        class="rounded p-2"
        [disabled]="currentPage() === 1"
        [attr.aria-disabled]="currentPage() === 1"
        [class.opacity-30]="currentPage() === 1"
        (click)="onPreviousPage()"
        aria-label="Página anterior"
      >
        <mat-icon class="!text-[1rem]">chevron_left</mat-icon>
      </button>

      @for (p of pageNumbers(); track p) {
      <button
        type="button"
        [class]="getPageButtonClass(p)"
        [attr.aria-current]="currentPage() === p ? 'page' : null"
        (click)="onGoToPage(p)"
      >
        {{ p }}
      </button>
      }

      <button
        type="button"
        class="rounded p-2"
        [disabled]="currentPage() === totalPages()"
        [attr.aria-disabled]="currentPage() === totalPages()"
        [class.opacity-30]="currentPage() === totalPages()"
        (click)="onNextPage()"
        aria-label="Próxima página"
      >
        <mat-icon class="!text-[1rem]">chevron_right</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly currentPage = input(1);
  readonly totalPages = input(1);
  readonly maxButtons = input(3);

  readonly pageChanged = output<number>();

  protected pageNumbers(): number[] {
    const max = this.maxButtons();
    const total = this.totalPages();
    const pages: number[] = [];

    for (let i = 1; i <= Math.min(max, total); i++) {
      pages.push(i);
    }

    return pages;
  }

  protected getPageButtonClass(page: number): string {
    const base = 'rounded px-3 py-1 text-xs font-bold';
    if (this.currentPage() === page) {
      return `${base} bg-[color:var(--mat-sys-primary)] text-white`;
    }
    return `${base} text-[color:var(--mat-sys-on-surface)]`;
  }

  protected onPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.pageChanged.emit(this.currentPage() - 1);
    }
  }

  protected onNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.pageChanged.emit(this.currentPage() + 1);
    }
  }

  protected onGoToPage(page: number): void {
    this.pageChanged.emit(page);
  }
}
