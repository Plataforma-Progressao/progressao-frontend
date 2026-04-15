import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-placeholder-page',
  imports: [MatIconModule],
  templateUrl: './placeholder-page.component.html',
  styleUrl: './placeholder-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceholderPageComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly title = computed(() => this.route.snapshot.data['title'] ?? 'Em breve');
  protected readonly description = computed(
    () =>
      this.route.snapshot.data['description'] ??
      'Esta funcionalidade está sendo preparada para a próxima etapa.',
  );
}
